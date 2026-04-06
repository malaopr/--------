from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.database import get_db
from app.models import User, Event
from app.schemas import EventCreate, EventUpdate, EventOut, EventListResponse
from app.services.auth import get_current_user, require_roles
from app.services.cache import cache_get, cache_set, cache_delete_pattern

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("", response_model=EventListResponse)
async def list_events(
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1, le=50),
    search: str = Query("", max_length=300),
    upcoming: bool = Query(False),
    db: AsyncSession = Depends(get_db),
):
    cache_key = f"events:{page}:{limit}:{search}:{upcoming}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    q = select(Event)
    count_q = select(func.count(Event.id))

    if search:
        pattern = f"%{search}%"
        filt = or_(Event.title.ilike(pattern), Event.content.ilike(pattern))
        q = q.where(filt)
        count_q = count_q.where(filt)

    if upcoming:
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        q = q.where(Event.event_date >= now)
        count_q = count_q.where(Event.event_date >= now)

    total = (await db.execute(count_q)).scalar() or 0
    rows = (await db.execute(
        q.order_by(Event.event_date.desc().nullslast()).offset((page - 1) * limit).limit(limit)
    )).scalars().all()

    result = EventListResponse(
        data=[EventOut.model_validate(e) for e in rows],
        total=total, page=page, limit=limit,
        total_pages=(total + limit - 1) // limit if total else 0,
    )
    await cache_set(cache_key, result.model_dump(), ttl=30)
    return result


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: str, db: AsyncSession = Depends(get_db)):
    event = await db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Мероприятие не найдено")
    return EventOut.model_validate(event)


@router.post("", response_model=EventOut, status_code=201)
async def create_event(
    body: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "teacher")),
):
    event = Event(author_id=current_user.id, **body.model_dump())
    db.add(event)
    await db.flush()
    await cache_delete_pattern("events:*")
    return EventOut.model_validate(event)


@router.patch("/{event_id}", response_model=EventOut)
async def update_event(
    event_id: str, body: EventUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = await db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Мероприятие не найдено")
    if event.author_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(403, "Недостаточно прав")

    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(event, field, val)
    await db.flush()
    await cache_delete_pattern("events:*")
    return EventOut.model_validate(event)


@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = await db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Мероприятие не найдено")
    if event.author_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(403, "Недостаточно прав")
    await db.delete(event)
    await cache_delete_pattern("events:*")
    return {"message": "Мероприятие удалено"}

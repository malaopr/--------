from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import User, Group, GroupMember
from app.schemas import GroupCreate, GroupUpdate, GroupOut, GroupListResponse, MessageResponse
from app.services.auth import get_current_user, require_roles
from app.services.cache import cache_get, cache_set, cache_delete_pattern

router = APIRouter(prefix="/api/groups", tags=["groups"])


async def _enrich(group: Group, db: AsyncSession) -> GroupOut:
    cnt = (await db.execute(
        select(func.count(GroupMember.id)).where(GroupMember.group_id == group.id)
    )).scalar() or 0
    out = GroupOut.model_validate(group)
    out.members_count = cnt
    return out


@router.get("", response_model=GroupListResponse)
async def list_groups(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query("", max_length=200),
    db: AsyncSession = Depends(get_db),
):
    cache_key = f"groups:{page}:{limit}:{search}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    q = select(Group)
    count_q = select(func.count(Group.id))
    if search:
        pattern = f"%{search}%"
        q = q.where(Group.name.ilike(pattern))
        count_q = count_q.where(Group.name.ilike(pattern))

    total = (await db.execute(count_q)).scalar() or 0
    rows = (await db.execute(
        q.order_by(Group.created_at.desc()).offset((page - 1) * limit).limit(limit)
    )).scalars().all()

    data = [await _enrich(g, db) for g in rows]
    result = GroupListResponse(
        data=data, total=total, page=page, limit=limit,
        total_pages=(total + limit - 1) // limit if total else 0,
    )
    await cache_set(cache_key, result.model_dump(), ttl=30)
    return result


@router.get("/{group_id}", response_model=GroupOut)
async def get_group(group_id: str, db: AsyncSession = Depends(get_db)):
    group = await db.get(Group, group_id)
    if not group:
        raise HTTPException(404, "Группа не найдена")
    return await _enrich(group, db)


@router.post("", response_model=GroupOut, status_code=201)
async def create_group(
    body: GroupCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("teacher", "admin")),
):
    group = Group(name=body.name, description=body.description, avatar_url=body.avatar_url, creator_id=current_user.id)
    db.add(group)
    await db.flush()
    
    db.add(GroupMember(group_id=group.id, user_id=current_user.id, role="moderator"))
    await db.flush()
    await cache_delete_pattern("groups:*")
    return await _enrich(group, db)


@router.patch("/{group_id}", response_model=GroupOut)
async def update_group(
    group_id: str, body: GroupUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = await db.get(Group, group_id)
    if not group:
        raise HTTPException(404, "Группа не найдена")
    if group.creator_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(403, "Недостаточно прав")

    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(group, field, val)
    await db.flush()
    await cache_delete_pattern("groups:*")
    return await _enrich(group, db)


@router.delete("/{group_id}")
async def delete_group(
    group_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = await db.get(Group, group_id)
    if not group:
        raise HTTPException(404, "Группа не найдена")
    if group.creator_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(403, "Недостаточно прав")
    await db.delete(group)
    await cache_delete_pattern("groups:*")
    return {"message": "Группа удалена"}




@router.post("/{group_id}/join", response_model=MessageResponse)
async def join_group(
    group_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = await db.get(Group, group_id)
    if not group:
        raise HTTPException(404, "Группа не найдена")
    existing = (await db.execute(
        select(GroupMember).where(GroupMember.group_id == group_id, GroupMember.user_id == current_user.id)
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(409, "Вы уже состоите в группе")
    db.add(GroupMember(group_id=group_id, user_id=current_user.id))
    await db.flush()
    await cache_delete_pattern("groups:*")
    return {"message": "Вы вступили в группу"}


@router.post("/{group_id}/leave", response_model=MessageResponse)
async def leave_group(
    group_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    mem = (await db.execute(
        select(GroupMember).where(GroupMember.group_id == group_id, GroupMember.user_id == current_user.id)
    )).scalar_one_or_none()
    if not mem:
        raise HTTPException(404, "Вы не состоите в группе")
    await db.delete(mem)
    await cache_delete_pattern("groups:*")
    return {"message": "Вы покинули группу"}

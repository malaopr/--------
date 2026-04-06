from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.database import get_db
from app.models import User
from app.schemas import UserOut, UserUpdate, UserListResponse
from app.services.auth import get_current_user, require_roles
from app.services.cache import cache_get, cache_set, cache_delete_pattern

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query("", max_length=200),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    cache_key = f"users:{page}:{limit}:{search}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    q = select(User)
    count_q = select(func.count(User.id))

    if search:
        pattern = f"%{search}%"
        filt = or_(
            User.first_name.ilike(pattern),
            User.last_name.ilike(pattern),
            User.grade.ilike(pattern),
            User.subject.ilike(pattern),
        )
        q = q.where(filt)
        count_q = count_q.where(filt)

    total = (await db.execute(count_q)).scalar() or 0
    rows = (await db.execute(
        q.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit)
    )).scalars().all()

    result = UserListResponse(
        data=[UserOut.model_validate(u) for u in rows],
        total=total, page=page, limit=limit,
        total_pages=(total + limit - 1) // limit if total else 0,
    )
    await cache_set(cache_key, result.model_dump(), ttl=30)
    return result


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "Пользователь не найден")
    return UserOut.model_validate(user)


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: str, body: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id and current_user.role.value != "admin":
        raise HTTPException(403, "Недостаточно прав")

    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "Пользователь не найден")

    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(user, field, val)

    await db.flush()
    await cache_delete_pattern("users:*")
    return UserOut.model_validate(user)


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "Пользователь не найден")
    await db.delete(user)
    await cache_delete_pattern("users:*")
    return {"message": "Пользователь удалён"}

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models import User, Post, Group, GroupMember, Comment
from app.schemas import PostCreate, PostUpdate, PostOut, PostListResponse, CommentCreate, CommentOut
from app.services.auth import get_current_user
from app.services.cache import cache_get, cache_set, cache_delete_pattern

router = APIRouter(prefix="/api/posts", tags=["posts"])


def _post_to_out(post: Post) -> PostOut:
    return PostOut(
        id=post.id,
        group_id=post.group_id,
        group_name=post.group.name if post.group else "",
        author_id=post.author_id,
        author_name=f"{post.author.first_name} {post.author.last_name}" if post.author else "",
        title=post.title,
        content=post.content,
        likes_count=post.likes_count,
        comments_count=len(post.comments) if post.comments else 0,
        created_at=post.created_at,
    )


@router.get("/feed", response_model=PostListResponse)
async def get_feed(
    page: int = Query(1, ge=1),
    limit: int = Query(6, ge=1, le=50),
    search: str = Query("", max_length=300),
    date_from: str = Query(None),
    date_to: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    cache_key = f"feed:{page}:{limit}:{search}:{date_from}:{date_to}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    q = select(Post).options(selectinload(Post.group), selectinload(Post.author), selectinload(Post.comments))
    count_q = select(func.count(Post.id))

    if search:
        pattern = f"%{search}%"
        filt = or_(Post.title.ilike(pattern), Post.content.ilike(pattern))
        q = q.where(filt)
        count_q = count_q.where(filt)

    from datetime import datetime
    if date_from:
        try:
            dt = datetime.fromisoformat(date_from)
            q = q.where(Post.created_at >= dt)
            count_q = count_q.where(Post.created_at >= dt)
        except ValueError:
            pass
    if date_to:
        try:
            dt = datetime.fromisoformat(date_to)
            q = q.where(Post.created_at <= dt)
            count_q = count_q.where(Post.created_at <= dt)
        except ValueError:
            pass

    total = (await db.execute(count_q)).scalar() or 0
    rows = (await db.execute(
        q.order_by(Post.created_at.desc()).offset((page - 1) * limit).limit(limit)
    )).scalars().unique().all()

    result = PostListResponse(
        data=[_post_to_out(p) for p in rows],
        total=total, page=page, limit=limit,
        total_pages=(total + limit - 1) // limit if total else 0,
    )
    await cache_set(cache_key, result.model_dump(), ttl=15)
    return result


@router.get("/{post_id}", response_model=PostOut)
async def get_post(post_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Post).options(selectinload(Post.group), selectinload(Post.author), selectinload(Post.comments))
        .where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(404, "Публикация не найдена")
    return _post_to_out(post)


@router.post("", response_model=PostOut, status_code=201)
async def create_post(
    body: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = await db.get(Group, body.group_id)
    if not group:
        raise HTTPException(404, "Группа не найдена")

    
    mem = (await db.execute(
        select(GroupMember).where(GroupMember.group_id == body.group_id, GroupMember.user_id == current_user.id)
    )).scalar_one_or_none()
    if not mem and current_user.role.value != "admin":
        raise HTTPException(403, "Вы не состоите в этой группе")

    post = Post(group_id=body.group_id, author_id=current_user.id, title=body.title, content=body.content)
    db.add(post)
    await db.flush()

   
    result = await db.execute(
        select(Post).options(selectinload(Post.group), selectinload(Post.author), selectinload(Post.comments))
        .where(Post.id == post.id)
    )
    post = result.scalar_one()
    await cache_delete_pattern("feed:*")
    return _post_to_out(post)


@router.patch("/{post_id}", response_model=PostOut)
async def update_post(
    post_id: str, body: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Post).options(selectinload(Post.group), selectinload(Post.author), selectinload(Post.comments))
        .where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(404, "Публикация не найдена")
    if post.author_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(403, "Недостаточно прав")

    for field, val in body.model_dump(exclude_unset=True).items():
        setattr(post, field, val)
    await db.flush()
    await cache_delete_pattern("feed:*")
    return _post_to_out(post)


@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = await db.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Публикация не найдена")
    if post.author_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(403, "Недостаточно прав")
    await db.delete(post)
    await cache_delete_pattern("feed:*")
    return {"message": "Публикация удалена"}


@router.post("/{post_id}/like")
async def like_post(post_id: str, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    post = await db.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Публикация не найдена")
    post.likes_count += 1
    await db.flush()
    await cache_delete_pattern("feed:*")
    return {"likes_count": post.likes_count}




@router.get("/{post_id}/comments", response_model=list[CommentOut])
async def list_comments(post_id: str, db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(
        select(Comment).options(selectinload(Comment.author))
        .where(Comment.post_id == post_id).order_by(Comment.created_at)
    )).scalars().all()
    return [
        CommentOut(
            id=c.id, post_id=c.post_id, author_id=c.author_id,
            author_name=f"{c.author.first_name} {c.author.last_name}" if c.author else "",
            author_avatar=c.author.avatar_url if c.author else None,
            content=c.content, created_at=c.created_at,
        ) for c in rows
    ]


@router.post("/{post_id}/comments", response_model=CommentOut, status_code=201)
async def create_comment(
    post_id: str, body: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = await db.get(Post, post_id)
    if not post:
        raise HTTPException(404, "Публикация не найдена")
    comment = Comment(post_id=post_id, author_id=current_user.id, content=body.content)
    db.add(comment)
    await db.flush()
    await cache_delete_pattern("feed:*")
    return CommentOut(
        id=comment.id, post_id=comment.post_id, author_id=comment.author_id,
        author_name=f"{current_user.first_name} {current_user.last_name}",
        author_avatar=current_user.avatar_url,
        content=comment.content, created_at=comment.created_at,
    )


@router.delete("/{post_id}/comments/{comment_id}")
async def delete_comment(
    post_id: str, comment_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = await db.get(Comment, comment_id)
    if not comment or comment.post_id != post_id:
        raise HTTPException(404, "Комментарий не найден")
    if comment.author_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(403, "Недостаточно прав")
    await db.delete(comment)
    await cache_delete_pattern("feed:*")
    return {"message": "Комментарий удалён"}

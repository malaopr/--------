import pytest
from app.tests.conftest import auth_header

pytestmark = pytest.mark.asyncio


async def _create_group(client, teacher_user):
    r = await client.post("/api/groups", json={"name": "G"}, headers=auth_header(teacher_user))
    return r.json()["id"]


async def test_create_post(client, teacher_user):
    gid = await _create_group(client, teacher_user)
    resp = await client.post("/api/posts", json={
        "group_id": gid, "title": "Hello", "content": "World",
    }, headers=auth_header(teacher_user))
    assert resp.status_code == 201
    assert resp.json()["title"] == "Hello"


async def test_create_post_not_member(client, teacher_user, student_user):
    gid = await _create_group(client, teacher_user)
    resp = await client.post("/api/posts", json={
        "group_id": gid, "title": "X", "content": "Y",
    }, headers=auth_header(student_user))
    assert resp.status_code == 403


async def test_feed_pagination(client, teacher_user):
    gid = await _create_group(client, teacher_user)
    for i in range(5):
        await client.post("/api/posts", json={
            "group_id": gid, "title": f"Post {i}", "content": "C",
        }, headers=auth_header(teacher_user))
    resp = await client.get("/api/posts/feed?page=1&limit=2")
    data = resp.json()
    assert data["total"] == 5
    assert len(data["data"]) == 2
    assert data["total_pages"] == 3


async def test_feed_search(client, teacher_user):
    gid = await _create_group(client, teacher_user)
    await client.post("/api/posts", json={"group_id": gid, "title": "Python Tips", "content": "C"}, headers=auth_header(teacher_user))
    await client.post("/api/posts", json={"group_id": gid, "title": "Chess", "content": "C"}, headers=auth_header(teacher_user))
    resp = await client.get("/api/posts/feed?search=python")
    assert resp.json()["total"] == 1


async def test_like_post(client, teacher_user, student_user):
    gid = await _create_group(client, teacher_user)
    r = await client.post("/api/posts", json={"group_id": gid, "title": "T", "content": "C"}, headers=auth_header(teacher_user))
    pid = r.json()["id"]
    resp = await client.post(f"/api/posts/{pid}/like", headers=auth_header(student_user))
    assert resp.json()["likes_count"] == 1


async def test_comments_crud(client, teacher_user):
    gid = await _create_group(client, teacher_user)
    r = await client.post("/api/posts", json={"group_id": gid, "title": "T", "content": "C"}, headers=auth_header(teacher_user))
    pid = r.json()["id"]

    
    resp = await client.post(f"/api/posts/{pid}/comments", json={"content": "Nice!"}, headers=auth_header(teacher_user))
    assert resp.status_code == 201
    cid = resp.json()["id"]

    
    resp = await client.get(f"/api/posts/{pid}/comments")
    assert len(resp.json()) == 1

    
    resp = await client.delete(f"/api/posts/{pid}/comments/{cid}", headers=auth_header(teacher_user))
    assert resp.status_code == 200


async def test_delete_post_forbidden(client, teacher_user, student_user):
    gid = await _create_group(client, teacher_user)
    r = await client.post("/api/posts", json={"group_id": gid, "title": "T", "content": "C"}, headers=auth_header(teacher_user))
    pid = r.json()["id"]
    resp = await client.delete(f"/api/posts/{pid}", headers=auth_header(student_user))
    assert resp.status_code == 403

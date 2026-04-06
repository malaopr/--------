"""
End-to-end test: full user scenario.
Register → Login → Create group → Join → Post → Comment → Feed
"""
import pytest

pytestmark = pytest.mark.asyncio


async def test_full_user_scenario(client):
   
    resp = await client.post("/api/auth/register", json={
        "email": "teacher@e2e.ru", "password": "pass123",
        "first_name": "E2E", "last_name": "Teacher", "role": "teacher",
    })
    assert resp.status_code == 201

    
    resp = await client.post("/api/auth/login", json={
        "email": "teacher@e2e.ru", "password": "pass123",
    })
    assert resp.status_code == 200
    teacher_token = resp.json()["access_token"]
    teacher_headers = {"Authorization": f"Bearer {teacher_token}"}

    
    resp = await client.post("/api/auth/register", json={
        "email": "student@e2e.ru", "password": "pass123",
        "first_name": "E2E", "last_name": "Student", "role": "student",
    })
    assert resp.status_code == 201

    
    resp = await client.post("/api/auth/login", json={
        "email": "student@e2e.ru", "password": "pass123",
    })
    student_token = resp.json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    
    resp = await client.post("/api/groups", json={
        "name": "E2E Group", "description": "Test group",
    }, headers=teacher_headers)
    assert resp.status_code == 201
    group_id = resp.json()["id"]

    
    resp = await client.post(f"/api/groups/{group_id}/join", headers=student_headers)
    assert resp.status_code == 200

    
    resp = await client.post("/api/posts", json={
        "group_id": group_id, "title": "Hello Group!", "content": "First post here",
    }, headers=student_headers)
    assert resp.status_code == 201
    post_id = resp.json()["id"]

    
    resp = await client.post(f"/api/posts/{post_id}/comments", json={
        "content": "Welcome!",
    }, headers=teacher_headers)
    assert resp.status_code == 201

    
    resp = await client.post(f"/api/posts/{post_id}/like", headers=student_headers)
    assert resp.json()["likes_count"] == 1

    
    resp = await client.get("/api/posts/feed")
    assert resp.json()["total"] >= 1
    assert any(p["id"] == post_id for p in resp.json()["data"])

    
    resp = await client.get(f"/api/groups/{group_id}")
    assert resp.json()["members_count"] == 2

    
    resp = await client.post(f"/api/groups/{group_id}/leave", headers=student_headers)
    assert resp.status_code == 200

    
    resp = await client.get(f"/api/groups/{group_id}")
    assert resp.json()["members_count"] == 1

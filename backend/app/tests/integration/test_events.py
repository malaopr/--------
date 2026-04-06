import pytest
from app.tests.conftest import auth_header

pytestmark = pytest.mark.asyncio


async def test_create_event_as_admin(client, admin_user):
    resp = await client.post("/api/events", json={
        "title": "Хакатон", "content": "24 часа кода",
        "location": "IT Центр",
    }, headers=auth_header(admin_user))
    assert resp.status_code == 201
    assert resp.json()["title"] == "Хакатон"


async def test_create_event_as_student_forbidden(client, student_user):
    resp = await client.post("/api/events", json={
        "title": "Nope", "content": "X",
    }, headers=auth_header(student_user))
    assert resp.status_code == 403


async def test_list_events(client, admin_user):
    await client.post("/api/events", json={"title": "E1", "content": "C"}, headers=auth_header(admin_user))
    await client.post("/api/events", json={"title": "E2", "content": "C"}, headers=auth_header(admin_user))
    resp = await client.get("/api/events")
    assert resp.json()["total"] == 2


async def test_search_events(client, admin_user):
    await client.post("/api/events", json={"title": "AI Lecture", "content": "C"}, headers=auth_header(admin_user))
    await client.post("/api/events", json={"title": "Concert", "content": "C"}, headers=auth_header(admin_user))
    resp = await client.get("/api/events?search=lecture")
    assert resp.json()["total"] == 1


async def test_update_event(client, admin_user):
    r = await client.post("/api/events", json={"title": "Old", "content": "C"}, headers=auth_header(admin_user))
    eid = r.json()["id"]
    resp = await client.patch(f"/api/events/{eid}", json={"title": "New"}, headers=auth_header(admin_user))
    assert resp.json()["title"] == "New"


async def test_delete_event(client, admin_user):
    r = await client.post("/api/events", json={"title": "Del", "content": "C"}, headers=auth_header(admin_user))
    eid = r.json()["id"]
    resp = await client.delete(f"/api/events/{eid}", headers=auth_header(admin_user))
    assert resp.status_code == 200

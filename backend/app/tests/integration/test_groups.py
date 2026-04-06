import pytest
from app.tests.conftest import auth_header

pytestmark = pytest.mark.asyncio


async def test_create_group_as_teacher(client, teacher_user):
    resp = await client.post("/api/groups", json={
        "name": "Test Group", "description": "Desc",
    }, headers=auth_header(teacher_user))
    assert resp.status_code == 201
    assert resp.json()["name"] == "Test Group"
    assert resp.json()["members_count"] == 1  


async def test_create_group_as_student_forbidden(client, student_user):
    resp = await client.post("/api/groups", json={
        "name": "Nope",
    }, headers=auth_header(student_user))
    assert resp.status_code == 403


async def test_list_groups(client, teacher_user):
    await client.post("/api/groups", json={"name": "G1"}, headers=auth_header(teacher_user))
    await client.post("/api/groups", json={"name": "G2"}, headers=auth_header(teacher_user))
    resp = await client.get("/api/groups")
    assert resp.status_code == 200
    assert resp.json()["total"] == 2


async def test_search_groups(client, teacher_user):
    await client.post("/api/groups", json={"name": "Python Club"}, headers=auth_header(teacher_user))
    await client.post("/api/groups", json={"name": "Chess"}, headers=auth_header(teacher_user))
    resp = await client.get("/api/groups?search=python")
    assert resp.json()["total"] == 1


async def test_join_and_leave(client, teacher_user, student_user):
    r = await client.post("/api/groups", json={"name": "G"}, headers=auth_header(teacher_user))
    gid = r.json()["id"]

    resp = await client.post(f"/api/groups/{gid}/join", headers=auth_header(student_user))
    assert resp.status_code == 200

    resp = await client.post(f"/api/groups/{gid}/join", headers=auth_header(student_user))
    assert resp.status_code == 409

    resp = await client.post(f"/api/groups/{gid}/leave", headers=auth_header(student_user))
    assert resp.status_code == 200


async def test_delete_group_by_admin(client, teacher_user, admin_user):
    r = await client.post("/api/groups", json={"name": "Del"}, headers=auth_header(teacher_user))
    gid = r.json()["id"]
    resp = await client.delete(f"/api/groups/{gid}", headers=auth_header(admin_user))
    assert resp.status_code == 200

import pytest

pytestmark = pytest.mark.asyncio


async def test_register(client):
    resp = await client.post("/api/auth/register", json={
        "email": "new@test.ru", "password": "pass123",
        "first_name": "Новый", "last_name": "Юзер", "role": "student",
    })
    assert resp.status_code == 201
    assert resp.json()["message"] == "Регистрация успешна"


async def test_register_duplicate(client, student_user):
    resp = await client.post("/api/auth/register", json={
        "email": "student@test.ru", "password": "pass123",
        "first_name": "A", "last_name": "B",
    })
    assert resp.status_code == 409


async def test_login(client, student_user):
    resp = await client.post("/api/auth/login", json={
        "email": "student@test.ru", "password": "pass123",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student@test.ru"


async def test_login_wrong_password(client, student_user):
    resp = await client.post("/api/auth/login", json={
        "email": "student@test.ru", "password": "wrong",
    })
    assert resp.status_code == 401


async def test_me(client, student_user):
    from app.tests.conftest import auth_header
    resp = await client.get("/api/auth/me", headers=auth_header(student_user))
    assert resp.status_code == 200
    assert resp.json()["id"] == "test-student"


async def test_me_no_token(client):
    resp = await client.get("/api/auth/me")
    assert resp.status_code == 401

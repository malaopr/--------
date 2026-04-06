import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.database import Base, get_db
from app.main import app
from app.models import User
from app.services.auth import hash_password, create_access_token

TEST_DB_URL = "sqlite+aiosqlite:///./test.db"

engine_test = create_async_engine(TEST_DB_URL)
async_session_test = async_sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)



async def _noop_get(key): return None
async def _noop_set(key, data, ttl=60): pass
async def _noop_del(pattern): pass

import app.services.cache as cache_mod
cache_mod.cache_get = _noop_get
cache_mod.cache_set = _noop_set
cache_mod.cache_delete_pattern = _noop_del

import app.routers.users as _ru
import app.routers.groups as _rg
import app.routers.posts as _rp
import app.routers.events as _re
for _m in (_ru, _rg, _rp, _re):
    _m.cache_get = _noop_get
    _m.cache_set = _noop_set
    _m.cache_delete_pattern = _noop_del


async def override_get_db():
    async with async_session_test() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session():
    async with async_session_test() as session:
        yield session


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def student_user(db_session: AsyncSession):
    user = User(id="test-student", email="student@test.ru", hashed_password=hash_password("pass123"),
                role="student", first_name="Тест", last_name="Студент", grade="10А")
    db_session.add(user)
    await db_session.commit()
    return user


@pytest_asyncio.fixture
async def teacher_user(db_session: AsyncSession):
    user = User(id="test-teacher", email="teacher@test.ru", hashed_password=hash_password("pass123"),
                role="teacher", first_name="Тест", last_name="Учитель", subject="Физика")
    db_session.add(user)
    await db_session.commit()
    return user


@pytest_asyncio.fixture
async def admin_user(db_session: AsyncSession):
    user = User(id="test-admin", email="admin@test.ru", hashed_password=hash_password("pass123"),
                role="admin", first_name="Тест", last_name="Админ")
    db_session.add(user)
    await db_session.commit()
    return user


def auth_header(user: User) -> dict:
    token = create_access_token({"sub": user.id, "role": user.role if isinstance(user.role, str) else user.role.value})
    return {"Authorization": f"Bearer {token}"}

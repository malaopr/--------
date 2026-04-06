# Campus Social — Backend API

REST API для социальной сети лицеистов. Python + FastAPI + PostgreSQL + Redis.

## Быстрый старт

```bash
docker-compose up --build
```

API доступен на `http://localhost:8000`. Документация: `http://localhost:8000/docs`.

### Заполню тестовыми данными

```bash
docker-compose exec api python seed.py
```

После этого можно логиниться: `ivanov@lyceum.ru` / `password` (студент), `admin@lyceum.ru` / `password` (админ).

## Стек

| Компонент | Технология |
|---|---|
| Фреймворк | FastAPI |
| СУБД | PostgreSQL 16 |
| ORM | SQLAlchemy 2.0 (async) |
| Миграции | Alembic |
| Кэширование | Redis 7 |
| Аутентификация | JWT (python-jose + passlib/bcrypt) |
| Валидация | Pydantic v2 |
| Контейнеризация | Docker + docker-compose |
| Тесты | pytest + httpx + aiosqlite |

## Структура

```
backend/
├── app/
│   ├── main.py              # FastAPI приложение
│   ├── config.py             # Настройки (env)
│   ├── database.py           # Async SQLAlchemy engine
│   ├── models/               # SQLAlchemy модели
│   ├── schemas/              # Pydantic схемы
│   ├── routers/              # API эндпоинты
│   │   ├── auth.py           # Регистрация, логин, /me
│   │   ├── users.py          # CRUD пользователей
│   │   ├── groups.py         # CRUD групп, вступление/выход
│   │   ├── posts.py          # CRUD постов, лайки, комментарии
│   │   └── events.py         # CRUD мероприятий
│   ├── services/
│   │   ├── auth.py           # JWT, хеширование, RBAC
│   │   └── cache.py          # Redis кэширование
│   └── tests/
│       ├── unit/             # Юнит-тесты (схемы, auth)
│       ├── integration/      # Интеграционные тесты (API)
│       └── e2e/              # E2E сценарий
├── alembic/                  # Миграции БД
├── docker-compose.yml
├── Dockerfile
├── seed.py                   # Заполнение тестовыми данными
└── requirements.txt
```

## API эндпоинты

### Auth
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход, возвращает JWT
- `GET /api/auth/me` — текущий пользователь

### Users
- `GET /api/users?page=1&limit=10&search=` — список с пагинацией и поиском
- `GET /api/users/{id}` — профиль
- `PATCH /api/users/{id}` — обновить (свой или admin)
- `DELETE /api/users/{id}` — удалить (только admin)

### Groups
- `GET /api/groups?page=1&limit=10&search=` — список
- `GET /api/groups/{id}` — детали
- `POST /api/groups` — создать (teacher/admin)
- `PATCH /api/groups/{id}` — обновить (владелец/admin)
- `DELETE /api/groups/{id}` — удалить (владелец/admin)
- `POST /api/groups/{id}/join` — вступить
- `POST /api/groups/{id}/leave` — покинуть

### Posts
- `GET /api/posts/feed?page=1&limit=6&search=&date_from=&date_to=` — лента
- `GET /api/posts/{id}` — пост
- `POST /api/posts` — создать (участник группы)
- `PATCH /api/posts/{id}` — обновить (автор/admin)
- `DELETE /api/posts/{id}` — удалить (автор/admin)
- `POST /api/posts/{id}/like` — лайк
- `GET /api/posts/{id}/comments` — комментарии
- `POST /api/posts/{id}/comments` — добавить комментарий
- `DELETE /api/posts/{id}/comments/{cid}` — удалить комментарий

### Events
- `GET /api/events?page=1&limit=6&search=&upcoming=false` — список
- `GET /api/events/{id}` — детали
- `POST /api/events` — создать (teacher/admin)
- `PATCH /api/events/{id}` — обновить (автор/admin)
- `DELETE /api/events/{id}` — удалить (автор/admin)

## Роли

| Роль | Права |
|---|---|
| student | Просмотр, вступление в группы, посты (в своих группах), комментарии, лайки |
| teacher | Всё что student + создание групп и мероприятий |
| admin | Полные права: удаление любых записей, создание мероприятий |

## Тесты

```bash

pip install -r requirements.txt aiosqlite
pytest app/tests/ -v


```

"""Seed the database with data matching the frontend mocks."""
import asyncio
from app.database import engine, async_session, Base
from app.models import User, Group, GroupMember, Post, Comment, Event
from app.services.auth import hash_password


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Users
        users = [
            User(id="u1", email="ivanov@lyceum.ru", hashed_password=hash_password("password"),
                 role="student", first_name="Иван", last_name="Иванов", grade="10А",
                 avatar_url="https://i.pravatar.cc/150?u=u1", bio="Увлекаюсь программированием и шахматами"),
            User(id="u2", email="petrova@lyceum.ru", hashed_password=hash_password("password"),
                 role="student", first_name="Екатерина", last_name="Петрова", grade="10Б",
                 avatar_url="https://i.pravatar.cc/150?u=u2", bio="Люблю математику и музыку"),
            User(id="u3", email="sidorov@lyceum.ru", hashed_password=hash_password("password"),
                 role="teacher", first_name="Алексей", last_name="Сидоров", subject="Информатика",
                 avatar_url="https://i.pravatar.cc/150?u=u3", bio="Преподаватель информатики, 10 лет опыта"),
            User(id="u4", email="admin@lyceum.ru", hashed_password=hash_password("password"),
                 role="admin", first_name="Мария", last_name="Кузнецова",
                 avatar_url="https://i.pravatar.cc/150?u=u4", bio="Администратор платформы"),
        ]
        db.add_all(users)
        await db.flush()

        
        groups = [
            Group(id="g1", name="IT Клуб", description="Разработка, код, алгоритмы и всё про технологии",
                  avatar_url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop", creator_id="u3"),
            Group(id="g2", name="Музыкальный бэнд", description="Студенческая группа, репетиции и джемы каждую пятницу",
                  avatar_url="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop", creator_id="u2"),
            Group(id="g3", name="Дискуссионный клуб", description="Обсуждение актуальных тем, дебаты, риторика",
                  avatar_url="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&h=100&fit=crop", creator_id="u3"),
            Group(id="g4", name="Киноклуб", description="Просмотр и анализ шедевров кинематографа",
                  avatar_url="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop", creator_id="u1"),
            Group(id="g5", name="Шахматный кружок", description="Спарринги, турниры, разбор партий",
                  avatar_url="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=100&h=100&fit=crop", creator_id="u1"),
            Group(id="g6", name="Волонтёрский отряд", description="Помощь нуждающимся, экологические акции",
                  avatar_url="https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop", creator_id="u4"),
        ]
        db.add_all(groups)
        await db.flush()

        
        members = [
            GroupMember(group_id="g1", user_id="u3", role="moderator"),
            GroupMember(group_id="g1", user_id="u1", role="member"),
            GroupMember(group_id="g2", user_id="u2", role="moderator"),
            GroupMember(group_id="g2", user_id="u1", role="member"),
            GroupMember(group_id="g3", user_id="u3", role="moderator"),
            GroupMember(group_id="g4", user_id="u1", role="moderator"),
            GroupMember(group_id="g5", user_id="u1", role="moderator"),
            GroupMember(group_id="g6", user_id="u4", role="moderator"),
        ]
        db.add_all(members)
        await db.flush()

        
        posts = [
            Post(id="p1", group_id="g1", author_id="u3", title="Встреча по алгоритмам — итоги",
                 content="Отличная встреча! Разобрали сортировку слиянием и бинарный поиск.", likes_count=12),
            Post(id="p2", group_id="g2", author_id="u2", title="Репетиция в пятницу",
                 content="Напоминаю, что в эту пятницу в 17:00 репетиция.", likes_count=8),
            Post(id="p3", group_id="g3", author_id="u3", title="Тема следующего заседания",
                 content="На следующем заседании обсуждаем: \"ИИ — угроза или возможность?\"", likes_count=15),
            Post(id="p4", group_id="g1", author_id="u1", title="Рекомендую курс по TypeScript",
                 content="Нашёл отличный бесплатный курс по TypeScript на русском языке.", likes_count=21),
            Post(id="p5", group_id="g4", author_id="u1", title="Смотрим \"Начало\" Нолана",
                 content="В эту среду в 18:30 смотрим \"Начало\" Кристофера Нолана.", likes_count=34),
            Post(id="p6", group_id="g5", author_id="u1", title="Результаты турнира",
                 content="Поздравляем победителей весеннего турнира!", likes_count=19),
        ]
        db.add_all(posts)
        await db.flush()

        
        comments = [
            Comment(id="c1", post_id="p1", author_id="u1", content="Спасибо за встречу! Очень полезно."),
            Comment(id="c2", post_id="p1", author_id="u2", content="Когда следующая встреча?"),
            Comment(id="c3", post_id="p2", author_id="u1", content="Буду! Какие песни готовим?"),
        ]
        db.add_all(comments)
        await db.flush()

        
        events = [
            Event(id="e1", author_id="u4", title="Лекция по ИИ",
                  content="Приглашённый лектор из ИТМО расскажет о достижениях в области ИИ.",
                  event_date="2026-03-21T18:00:00Z", location="Аудитория 101"),
            Event(id="e2", author_id="u4", title="Сбор волонтёров",
                  content="Весенняя уборка территории лицея.",
                  event_date="2026-03-22T12:00:00Z", location="Главная площадь"),
            Event(id="e3", author_id="u4", title="Хакатон 2026",
                  content="24-часовой хакатон для учеников. Тема: \"Технологии для образования\".",
                  event_date="2026-04-05T09:00:00Z", location="IT Центр"),
            Event(id="e4", author_id="u4", title="Весенний концерт",
                  content="Ежегодный весенний концерт лицея.",
                  event_date="2026-04-20T17:00:00Z", location="Актовый зал"),
            Event(id="e5", author_id="u4", title="Олимпиада по математике",
                  content="Внутрилицейская олимпиада по математике.",
                  event_date="2026-04-10T10:00:00Z", location="Кабинет 205"),
            Event(id="e6", author_id="u4", title="День открытых дверей",
                  content="Приглашаем будущих учеников познакомиться с лицеем.",
                  event_date="2026-04-15T11:00:00Z", location="Главный корпус"),
        ]
        db.add_all(events)
        await db.commit()
        print("Seed complete")


if __name__ == "__main__":
    asyncio.run(seed())

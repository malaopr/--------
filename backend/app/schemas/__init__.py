from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from enum import Enum




class PaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int



class RoleEnum(str, Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    role: RoleEnum = RoleEnum.student
    grade: str | None = None
    subject: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"




class UserOut(BaseModel):
    id: str
    email: str
    role: str
    first_name: str
    last_name: str
    grade: str | None = None
    subject: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    first_name: str | None = Field(None, min_length=1, max_length=100)
    last_name: str | None = Field(None, min_length=1, max_length=100)
    bio: str | None = None
    avatar_url: str | None = None
    grade: str | None = None
    subject: str | None = None


class UserListResponse(PaginatedResponse):
    data: list[UserOut]



class GroupCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = ""
    avatar_url: str | None = None


class GroupUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    avatar_url: str | None = None


class GroupOut(BaseModel):
    id: str
    name: str
    description: str
    avatar_url: str | None = None
    creator_id: str
    members_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class GroupListResponse(PaginatedResponse):
    data: list[GroupOut]




class PostCreate(BaseModel):
    group_id: str
    title: str = Field(min_length=1, max_length=300)
    content: str = Field(min_length=1)


class PostUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=300)
    content: str | None = None


class PostOut(BaseModel):
    id: str
    group_id: str
    group_name: str = ""
    author_id: str
    author_name: str = ""
    title: str
    content: str
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class PostListResponse(PaginatedResponse):
    data: list[PostOut]




class CommentCreate(BaseModel):
    content: str = Field(min_length=1)


class CommentOut(BaseModel):
    id: str
    post_id: str
    author_id: str
    author_name: str = ""
    author_avatar: str | None = None
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}




class EventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    content: str = Field(min_length=1)
    event_date: datetime | None = None
    location: str | None = None
    image_url: str | None = None


class EventUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=300)
    content: str | None = None
    event_date: datetime | None = None
    location: str | None = None
    image_url: str | None = None


class EventOut(BaseModel):
    id: str
    author_id: str
    title: str
    content: str
    event_date: datetime | None = None
    location: str | None = None
    image_url: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class EventListResponse(PaginatedResponse):
    data: list[EventOut]


class MessageResponse(BaseModel):
    message: str

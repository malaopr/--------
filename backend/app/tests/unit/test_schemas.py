import pytest
from pydantic import ValidationError
from app.schemas import RegisterRequest, PostCreate, CommentCreate, GroupCreate


def test_register_valid():
    r = RegisterRequest(email="a@b.com", password="123456", first_name="A", last_name="B")
    assert r.role.value == "student"


def test_register_short_password():
    with pytest.raises(ValidationError):
        RegisterRequest(email="a@b.com", password="123", first_name="A", last_name="B")


def test_register_invalid_email():
    with pytest.raises(ValidationError):
        RegisterRequest(email="not-email", password="123456", first_name="A", last_name="B")


def test_post_create_empty_title():
    with pytest.raises(ValidationError):
        PostCreate(group_id="g1", title="", content="text")


def test_comment_create_empty():
    with pytest.raises(ValidationError):
        CommentCreate(content="")


def test_group_create_valid():
    g = GroupCreate(name="Test Group")
    assert g.description == ""

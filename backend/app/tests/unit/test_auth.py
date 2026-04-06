from app.services.auth import hash_password, verify_password, create_access_token
from jose import jwt
from app.config import get_settings


def test_hash_and_verify():
    h = hash_password("mypassword")
    assert verify_password("mypassword", h)
    assert not verify_password("wrong", h)


def test_create_access_token():
    settings = get_settings()
    token = create_access_token({"sub": "user-1", "role": "student"})
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == "user-1"
    assert payload["role"] == "student"
    assert "exp" in payload

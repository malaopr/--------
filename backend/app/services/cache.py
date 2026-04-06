import json
import redis.asyncio as redis
from app.config import get_settings

settings = get_settings()
_redis: redis.Redis | None = None


async def get_redis() -> redis.Redis:
    global _redis
    if _redis is None:
        _redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis


async def cache_get(key: str) -> dict | list | None:
    r = await get_redis()
    val = await r.get(key)
    if val:
        return json.loads(val)
    return None


async def cache_set(key: str, data, ttl: int = 60):
    r = await get_redis()
    await r.set(key, json.dumps(data, default=str), ex=ttl)


async def cache_delete_pattern(pattern: str):
    r = await get_redis()
    keys = []
    async for key in r.scan_iter(match=pattern):
        keys.append(key)
    if keys:
        await r.delete(*keys)

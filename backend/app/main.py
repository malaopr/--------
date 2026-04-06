from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import get_settings
from app.routers import auth, users, groups, posts, events

settings = get_settings()

app = FastAPI(
    title="Campus Social API",
    description="REST API для социальной сети лицеистов",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Внутренняя ошибка сервера"})


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=422, content={"detail": str(exc)})




app.include_router(auth.router)
app.include_router(users.router)
app.include_router(groups.router)
app.include_router(posts.router)
app.include_router(events.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.backend.db import base, engine
from app.backend.routers import admin, export, tracking  # ordem não importa

app = FastAPI(title="Phishing Collector API")

# ───────────────────────────────────────────────────────────────────── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # use ["*"] só em dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────── cria tabelas no start-up ──
@app.on_event("startup")
async def on_startup() -> None:
    base.Base.metadata.create_all(bind=engine.engine)

# ─────────────────────────────────────────────────────── registre routers ──
app.include_router(tracking.router, prefix="/landing", tags=["Landing"])
app.include_router(export.router)                          # já tem /data
app.include_router(admin.router,  prefix="/admin",  tags=["Admin"])

# ─────────────────────────────────────────────────────────── health-check ──
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API Phishing Collector!"}

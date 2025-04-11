from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.backend.db import base, engine
from app.backend.routers import landing, export

app = FastAPI(title="Phishing Collector API")

# Configura o CORS aqui
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ou ["*"] em desenvolvimento
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criação das tabelas no evento de startup
@app.on_event("startup")
async def on_startup():
    base.Base.metadata.create_all(bind=engine.engine)

app.include_router(landing.router, prefix="/landing", tags=["Landing"])
app.include_router(export.router, prefix="/data", tags=["Export"])

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API Phishing Collector!"}

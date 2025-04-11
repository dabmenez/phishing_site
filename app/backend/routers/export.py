from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.backend.crud import crud
from app.backend.db.schemas import UserDataOut
from app.backend.db.engine import SessionLocal

router = APIRouter()

# Função para obter a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/export", response_model=List[UserDataOut])
def export_data(db: Session = Depends(get_db)):
    """
    Endpoint para exportar os dados coletados.
    Retorna uma lista de registros salvos no banco de dados.
    """
    usuarios = crud.get_all_user_data(db)
    return usuarios

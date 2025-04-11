from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.backend.crud import crud
from app.backend.db.schemas import UserDataCreate, UserDataOut
from app.backend.db.engine import SessionLocal

router = APIRouter()

# Função que fornece a sessão do banco para os endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=dict)
def landing_page():
    """
    Endpoint da landing page. Pode retornar uma mensagem ou até mesmo um HTML.
    """
    return {"message": "Bem-vindo à landing page da Phishing Collector"}

@router.post("/collect", response_model=UserDataOut)
def collect_data(user_data: UserDataCreate, db: Session = Depends(get_db)):
    """
    Endpoint para coleta dos dados do usuário.
    Recebe os dados via POST e salva no banco.
    """
    novo_usuario = crud.create_user_data(db, user_data)
    if not novo_usuario:
        raise HTTPException(status_code=400, detail="Erro ao coletar os dados")
    return novo_usuario

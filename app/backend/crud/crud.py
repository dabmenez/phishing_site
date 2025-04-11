from sqlalchemy.orm import Session
from app.backend.db import models, schemas

def create_user_data(db: Session, user_data: schemas.UserDataCreate):
    """
    Cria um registro de usuário no banco de dados com base nos dados recebidos.
    """
    novo_user = models.UserData(
        email=user_data.email,
        password=user_data.password
        # Se houver outros campos, inclua aqui
    )
    db.add(novo_user)
    db.commit()
    db.refresh(novo_user)
    return novo_user

def get_user_data(db: Session, user_id: int):
    """
    Retorna um registro de usuário baseado no ID.
    """
    return db.query(models.UserData).filter(models.UserData.id == user_id).first()

def get_all_user_data(db: Session, skip: int = 0, limit: int = 100):
    """
    Retorna uma lista de registros de usuário.
    """
    return db.query(models.UserData).offset(skip).limit(limit).all()

def update_user_data(db: Session, user_id: int, updated_data: schemas.UserDataCreate):
    """
    Atualiza os dados de um registro de usuário existente.
    """
    user = db.query(models.UserData).filter(models.UserData.id == user_id).first()
    if not user:
        return None  # ou levantar uma exceção

    # Atualiza os campos; supondo que queremos atualizar email e password
    user.email = updated_data.email
    user.password = updated_data.password
    db.commit()
    db.refresh(user)
    return user

def delete_user_data(db: Session, user_id: int):
    """
    Remove um registro de usuário do banco de dados pelo ID.
    """
    user = db.query(models.UserData).filter(models.UserData.id == user_id).first()
    if not user:
        return False  # ou levantar uma exceção
    db.delete(user)
    db.commit()
    return True

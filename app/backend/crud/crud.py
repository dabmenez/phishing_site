from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.backend.db import models, schemas


# --------------------------------------------------------------------------- #
# CRIAÇÃO DE SUBMISSÃO (formulário phishing)
# --------------------------------------------------------------------------- #
def create_user_data(db: Session, data: schemas.UserDataCreate):
    """
    Insere um registro completo de dados submetidos via landing.
    """
    db_obj = models.UserData(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# --------------------------------------------------------------------------- #
# CONSULTAS ÚTEIS (admin ou exportação)
# --------------------------------------------------------------------------- #
def get_user_data(db: Session, user_id: int):
    return db.query(models.UserData).filter(models.UserData.id == user_id).first()


def get_all_user_data(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.UserData).offset(skip).limit(limit).all()


def delete_user_data(db: Session, user_id: int):
    obj = db.query(models.UserData).filter(models.UserData.id == user_id).first()
    if not obj:
        return False

    db.delete(obj)
    db.commit()
    return True


def get_target_links(db: Session):
    return db.query(models.TargetLink).all()

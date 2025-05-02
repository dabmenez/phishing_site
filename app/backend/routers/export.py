from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.backend.db.engine import SessionLocal
from app.backend.db.models import UserData
from app.backend.db.schemas import UserDataOut

router = APIRouter(prefix="/data", tags=["export"])  # → rota final /data/export


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------------------------------- #
# endpoint
# --------------------------------------------------------------------------- #
# app/backend/routers/export.py
@router.get("/export", response_model=List[UserDataOut])
def export_data(db: Session = Depends(get_db)):
    rows = (
        db.query(UserData)
        .order_by(UserData.timestamp.desc())
        .all()
    )
    return rows
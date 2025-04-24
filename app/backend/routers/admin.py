# app/backend/routers/admin.py
from datetime import datetime
import base64, hashlib
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.backend.db.engine import SessionLocal
from app.backend.db.models import TargetLink
from app.backend.db.schemas import TargetLinkCreate, TargetLinkOut, Stats

router = APIRouter(tags=["admin"])


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def generate_link_id(email: str) -> str:        # ← ESTA FUNÇÃO PRECISA EXISTIR!
    raw = f"{email}:{datetime.utcnow().isoformat()}"
    digest = hashlib.sha256(raw.encode()).digest()
    return base64.urlsafe_b64encode(digest)[:8].decode()


# --------------------------------------------------------------------------- #
# endpoints
# --------------------------------------------------------------------------- #
@router.post("/generate-link", response_model=TargetLinkOut)
def generate_tracking_link(link: TargetLinkCreate, db: Session = Depends(get_db)):
    link_id = generate_link_id(link.email)      # agora o nome existe
    target_link = TargetLink(
        email=link.email,
        campaign=link.campaign,
        link_id=link_id,
        created_at=datetime.utcnow(),
    )
    try:
        db.add(target_link)
        db.commit()
        db.refresh(target_link)
        return target_link
    except Exception:
        db.rollback()
        raise HTTPException(400, "Error generating link")


@router.get("/target-link", response_model=List[TargetLinkOut])
def get_all_links(db: Session = Depends(get_db)):
    return db.query(TargetLink).all()


@router.get("/stats", response_model=Stats)
def get_stats(db: Session = Depends(get_db)):
    total_links = db.query(TargetLink).count()
    total_clicks = db.query(TargetLink).filter(TargetLink.clicked_at.isnot(None)).count()
    total_submissions = db.query(TargetLink).filter(TargetLink.submitted_at.isnot(None)).count()
    return Stats(
        total_links=total_links,
        total_clicks=total_clicks,
        total_submissions=total_submissions,
    )

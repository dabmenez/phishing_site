from urllib import response
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import hashlib
import base64
from datetime import datetime

from app.backend.db.engine import SessionLocal
from app.backend.db.models import TargetLink
from app.backend.db.schemas import TargetLinkCreate, TargetLinkList, TargetLinkOut, Stats

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_link_id(email: str) -> str:
    """Gera um link ID único a partir de um email."""
    hash_input = f"{email}:{datetime.utcnow().isoformat()}"
    hash_object = hashlib.sha256(hash_input.encode())
    return base64.urlsafe_b64encode(hash_object.digest())[:8].decode()

@router.get("/target-link", response_model=List[TargetLinkOut])
def get_all_links(db: Session = Depends(get_db)):
    """Obtém todos os links rastreáveis"""
    links = db.query(TargetLink).all()
    return links

@router.post("/generate-link", response_model=TargetLinkOut)
def generate_tracking_link(email: str, db: Session = Depends(get_db)):
    """Gera um link rastreável único para cada email."""
    link_id = generate_link_id(email)
    
    target_link = TargetLink(
        email=email,
        link_id=link_id,
        created_at=datetime.utcnow()
    )
    
    try:
        db.add(target_link)
        db.commit()
        db.refresh(target_link)
        return target_link
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error generating link")

@router.get("/stats", response_model=Stats)
def get_stats(db: Session = Depends(get_db)):
    """Obter estatísticas gerais."""
    total_links = db.query(TargetLink).count()
    total_clicks = db.query(TargetLink).filter(TargetLink.clicked_at.isnot(None)).count()
    total_submissions = db.query(TargetLink).filter(TargetLink.submitted_at.isnot(None)).count()
    
    return Stats(
        total_links=total_links,
        total_clicks=total_clicks,
        total_submissions=total_submissions
    )

from datetime import datetime, timezone
import base64, hashlib
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.backend.db.engine  import SessionLocal
from app.backend.db.models  import TargetLink, UserData
from app.backend.db.schemas import (
    TargetLinkCreate, TargetLinkOut, Stats, EmailsPayload, BulkLinkCreate
)

router = APIRouter(tags=["admin"])

# ───────────────────────── helpers ─────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_link_id(email: str) -> str:
    raw = f"{email}:{datetime.now(timezone.utc).isoformat()}"
    digest = hashlib.sha256(raw.encode()).digest()
    return base64.urlsafe_b64encode(digest)[:8].decode()

# ─────────────────────── endpoints ────────────────────────

@router.post("/generate-link", response_model=TargetLinkOut)
def generate_tracking_link(link: TargetLinkCreate, db: Session = Depends(get_db)):
    target_link = TargetLink(
        email=link.email,
        campaign=link.campaign,
        link_id=generate_link_id(link.email),
        created_at=datetime.now(timezone.utc),
    )
    try:
        db.add(target_link)
        db.commit()
        db.refresh(target_link)
        return target_link
    except Exception:
        db.rollback()
        raise HTTPException(400, "Error generating link")

@router.post("/generate-bulk", status_code=201)
def generate_links_bulk(links: List[BulkLinkCreate], db: Session = Depends(get_db)):
    if not links:
        raise HTTPException(400, "Lista vazia")

    now = datetime.now(timezone.utc)
    objs = []
    for item in links:
        objs.append(TargetLink(
            email=item.email,
            campaign=item.campaign,
            link_id=generate_link_id(item.email),
            created_at=now,
        ))

    try:
        db.bulk_save_objects(objs)
        db.commit()
        return {"message": f"{len(objs)} links criados com sucesso"}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Erro ao importar links: {str(e)}")

@router.get("/target-link", response_model=List[TargetLinkOut])
def get_all_links(db: Session = Depends(get_db)):
    return jsonable_encoder(db.query(TargetLink).all())

@router.get("/stats", response_model=Stats)
def get_stats(db: Session = Depends(get_db)):
    q = db.query(TargetLink)
    return Stats(
        total_links       = q.count(),
        total_clicks      = q.filter(TargetLink.clicked_at.isnot(None)).count(),
        total_submissions = q.filter(TargetLink.submitted_at.isnot(None)).count(),
    )

@router.delete("/emails", status_code=204)
def delete_emails(payload: EmailsPayload, db: Session = Depends(get_db)):
    if not payload.emails:
        raise HTTPException(400, "empty-list")

    link_ids = [
        x[0] for x in
        db.query(TargetLink.link_id)
          .filter(TargetLink.email.in_(payload.emails))
          .all()
    ]

    if link_ids:
        db.query(UserData).filter(UserData.link_id.in_(link_ids)).delete(synchronize_session=False)
        db.query(TargetLink).filter(TargetLink.link_id.in_(link_ids)).delete(synchronize_session=False)
    db.commit()

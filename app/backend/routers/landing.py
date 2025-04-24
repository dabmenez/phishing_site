from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.backend.crud import crud
from app.backend.db.engine import SessionLocal
from app.backend.db.models import TargetLink
from app.backend.db.schemas import UserDataCreate, UserDataOut

router = APIRouter()

# ------------------------------------------------------------------ #
# helpers
# ------------------------------------------------------------------ #
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_client_info(request: Request):
    return {
        "ip_address": request.client.host,
        "user_agent": request.headers.get("user-agent", ""),
    }

# ------------------------------------------------------------------ #
# 1. pixel de abertura
# ------------------------------------------------------------------ #
@router.get("/open/{link_id}")
async def track_open(link_id: str, request: Request, db: Session = Depends(get_db)):
    """
    Marca opened_at na primeira vez que o e-mail é carregado.
    Retorna um GIF 1×1 transparente.
    """
    target_link = db.query(TargetLink).filter_by(link_id=link_id).first()
    if not target_link:
        raise HTTPException(status_code=404, detail="Link not found")

    if not target_link.opened_at:
        info = get_client_info(request)
        target_link.opened_at = datetime.utcnow()
        target_link.ip_address = info["ip_address"]
        target_link.user_agent = info["user_agent"]
        db.commit()

    # GIF transparente 1×1 (87 bytes)
    gif = (
        b"GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00"
        b"\xff\xff\xff!\xf9\x04\x01\x00\x00\x00\x00,\x00"
        b"\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    )
    return Response(content=gif, media_type="image/gif")

# ------------------------------------------------------------------ #
# 2. clique no link
# ------------------------------------------------------------------ #
@router.get("/l/{link_id}")
async def record_click(request: Request, link_id: str, db: Session = Depends(get_db)):
    target_link = db.query(TargetLink).filter_by(link_id=link_id).first()
    if not target_link:
        raise HTTPException(status_code=404, detail="Link not found")

    if not target_link.clicked_at:
        info = get_client_info(request)
        target_link.clicked_at = datetime.utcnow()
        target_link.ip_address = info["ip_address"]
        target_link.user_agent = info["user_agent"]
        db.commit()

    return {"status": "success"}

# ------------------------------------------------------------------ #
# 3. submissão de dados
# ------------------------------------------------------------------ #
@router.post("/submit/{link_id}", response_model=UserDataOut)
async def submit_data(
    request: Request,
    link_id: str,
    user_data: UserDataCreate,
    db: Session = Depends(get_db),
):
    target_link = db.query(TargetLink).filter_by(link_id=link_id).first()
    if not target_link:
        raise HTTPException(status_code=404, detail="Link not found")

    target_link.submitted_at = datetime.utcnow()
    db.commit()

    return crud.create_user_data(db, user_data)

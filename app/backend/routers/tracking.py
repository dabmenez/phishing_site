from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.backend.crud import crud
from app.backend.db.engine import SessionLocal
from app.backend.db.models import TargetLink
from app.backend.db.schemas import UserDataCreate, UserDataOut

router = APIRouter(tags=["tracking"])


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def now_utc() -> datetime:
    """Datetime timezone-aware em UTC (ISO-8601)."""
    return datetime.now(timezone.utc)


# --------------------------------------------------------------------------- #
# endpoints
# --------------------------------------------------------------------------- #
@router.get("/l/{link_id}", status_code=204)
async def record_click(request: Request, link_id: str, db: Session = Depends(get_db)):
    """
    • Marca `clicked_at` (somente na 1ª vez)
    • Registra IP + User-Agent
    • Retorna 204 No Content
    """
    target_link = db.query(TargetLink).filter_by(link_id=link_id).first()
    if target_link is None:
        raise HTTPException(status_code=404, detail="Link not found")

    if target_link.clicked_at is None:          # idempotente
        target_link.clicked_at = now_utc()
        target_link.ip_address = request.client.host
        target_link.user_agent = request.headers.get("user-agent", "")
        db.commit()

    return  # 204


@router.post("/submit/{link_id}", response_model=UserDataOut, status_code=201)
async def submit_data(
    request: Request,
    link_id: str,
    payload: UserDataCreate,
    db: Session = Depends(get_db),
):
    link = db.query(TargetLink).filter_by(link_id=link_id).first()
    if not link:
        raise HTTPException(404, "Link not found")

    now = now_utc()
    # 1) audita o TargetLink
    link.submitted_at = now
    link.ip_address   = request.client.host
    link.user_agent   = request.headers.get("user-agent", "")
    db.commit()

    # 2) preenche só email+password do cliente
    data_dict = payload.model_dump(exclude_none=True)
    # agora data_dict == {"email": "...", "password": "..."}
    enriched = UserDataCreate(
        **data_dict,
        link_id    = link_id,
        timestamp  = now,
        ip_address = request.client.host,
        user_agent = request.headers.get("user-agent", ""),
    )
    return crud.create_user_data(db, enriched)

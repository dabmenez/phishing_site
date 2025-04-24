from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.backend.crud import crud
from app.backend.db.schemas import UserDataCreate, UserDataOut
from app.backend.db.engine import SessionLocal
from app.backend.db.models import TargetLink

router = APIRouter()
templates = Jinja2Templates(directory="app/backend/templates")

# Função que fornece a sessão do banco para os endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_client_info(request: Request):
    """Get client IP and user agent."""
    return {
        'ip_address': request.client.host,
        'user_agent': request.headers.get('user-agent', '')
    }

@router.get("/l/{link_id}")
async def record_click(request: Request, link_id: str, db: Session = Depends(get_db)):
    """Record when a link is clicked"""
    target_link = db.query(TargetLink).filter(TargetLink.link_id == link_id).first()
    if not target_link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    if not target_link.clicked_at:
        target_link.clicked_at = datetime.utcnow()
        target_link.ip_address = request.client.host
        target_link.user_agent = request.headers.get('user-agent', '')
        db.commit()
    
    return {"status": "success"}

@router.post("/submit/{link_id}", response_model=UserDataOut)
async def submit_data(
    request: Request,
    link_id: str,
    user_data: UserDataCreate,
    db: Session = Depends(get_db)
):
    """Handle form submissions"""
    target_link = db.query(TargetLink).filter(TargetLink.link_id == link_id).first()
    if not target_link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    target_link.submitted_at = datetime.utcnow()
    db.commit()
    
    return crud.create_user_data(db, user_data)

# app/backend/db/schemas.py
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class UserDataBase(BaseModel):
    email: str
    password: str

class UserDataCreate(UserDataBase):
    pass

class UserDataOut(BaseModel):
    id: int
    email: str
    created_at: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    link_id: Optional[str] = None

    class Config:
        from_attributes = True

class TargetLinkBase(BaseModel):
    email: str

class TargetLinkCreate(TargetLinkBase):
    pass

class TargetLinkOut(BaseModel):
    id: int
    email: str
    link_id: str
    created_at: datetime
    clicked_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        from_attributes = True

class TargetLinkList(BaseModel):
    id: int
    email: str
    link_id: str
    created_at: datetime
    clicked_at: Optional[datetime]
    submitted_at: Optional[datetime]

    class Config:
        orm_mode = True

class Stats(BaseModel):
    total_links: int
    total_opens: int          # 👈 obrigatório
    total_clicks: int
    total_submissions: int
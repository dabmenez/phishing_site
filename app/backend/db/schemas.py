from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict


# --------------------------------------------------------------------------- #
# Submissions (formulários)
# --------------------------------------------------------------------------- #
class UserDataBase(BaseModel):
    email: EmailStr
    password: str

class UserDataCreate(UserDataBase):
    link_id: Optional[str]        = None
    timestamp: Optional[datetime] = None
    ip_address: Optional[str]     = None
    user_agent: Optional[str]     = None

class UserDataOut(UserDataBase):
    id: int
    link_id: str
    timestamp: datetime
    ip_address: Optional[str]
    user_agent: Optional[str]

    model_config = ConfigDict(from_attributes=True)


# --------------------------------------------------------------------------- #
# Target links
# --------------------------------------------------------------------------- #
class TargetLinkBase(BaseModel):
    email: EmailStr
    campaign: Optional[str] = None

class TargetLinkCreate(TargetLinkBase):
    pass

class TargetLinkOut(BaseModel):
    id: int
    email: EmailStr
    link_id: str
    campaign: Optional[str]
    created_at: datetime
    clicked_at: Optional[datetime]
    submitted_at: Optional[datetime]
    ip_address: Optional[str]
    user_agent: Optional[str]

    model_config = ConfigDict(from_attributes=True)

class TargetLinkList(BaseModel):
    id: int
    email: EmailStr
    campaign: Optional[str] = None
    link_id: str
    created_at: datetime
    clicked_at: Optional[datetime]
    submitted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# --------------------------------------------------------------------------- #
# Estatísticas
# --------------------------------------------------------------------------- #
class Stats(BaseModel):
    total_links: int
    total_clicks: int
    total_submissions: int


class UserDataUpdate(BaseModel):
    email: Optional[EmailStr]      = None
    password: Optional[str]        = None
    timestamp: Optional[datetime]  = None
    ip_address: Optional[str]      = None
    user_agent: Optional[str]      = None

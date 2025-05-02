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

    model_config = ConfigDict(
        alias_generator=lambda s: ''.join(w.title() if i>0 else w 
                                         for i,w in enumerate(s.split('_'))),
        populate_by_name=True
    )

class UserDataUpdate(BaseModel):
    email: Optional[EmailStr]      = None
    password: Optional[str]        = None
    timestamp: Optional[datetime]  = None
    ip_address: Optional[str]      = None
    user_agent: Optional[str]      = None

# --------------------------------------------------------------------------- #
# Ações em lote (Admin)
# --------------------------------------------------------------------------- #
class EmailsPayload(BaseModel):
    """Payload para apagar todos os dados ligados a uma lista de e-mails."""
    emails: List[EmailStr]

    model_config = ConfigDict(
        json_schema_extra={"example": {"emails": ["ana@ex.com", "bob@ex.com"]}},
        min_anystr_length=1,
    )

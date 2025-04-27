from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.backend.db.base import Base


def utcnow():
    """Retorna um datetime timezone-aware em UTC (compatível com SQLite, Postgres, etc.)."""
    return datetime.now(timezone.utc)


class UserData(Base):
    __tablename__ = "user_data"

    id          = Column(Integer, primary_key=True, index=True)
    link_id     = Column(String, ForeignKey("target_link.link_id"), nullable=False)
    email       = Column(String, nullable=False)
    password    = Column(String, nullable=False)
    timestamp   = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    ip_address  = Column(String)
    user_agent  = Column(Text)

    target_link = relationship("TargetLink", back_populates="submissions")

class TargetLink(Base):
    __tablename__ = "target_link"

    id           = Column(Integer, primary_key=True, index=True)
    email        = Column(String,  nullable=False)
    campaign     = Column(String)                 # opcional – use para agrupar
    link_id      = Column(String,  unique=True, nullable=False)

    created_at   = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    clicked_at   = Column(DateTime(timezone=True))
    submitted_at = Column(DateTime(timezone=True))

    # última origem (pode ser sobrescrita se clicar > 1x)
    ip_address   = Column(String)
    user_agent   = Column(Text)

    submissions  = relationship("UserData", back_populates="target_link")

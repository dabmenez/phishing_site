from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.backend.db.base import Base


def utcnow():
    """Datetime timezone-aware em UTC (SQLite, Postgres, etc.)."""
    return datetime.now(timezone.utc)


class TargetLink(Base):
    __tablename__ = "target_link"

    id           = Column(Integer, primary_key=True, index=True)
    email        = Column(String, nullable=False)
    campaign     = Column(String)
    link_id      = Column(String, unique=True, nullable=False)

    created_at   = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    clicked_at   = Column(DateTime(timezone=True))
    submitted_at = Column(DateTime(timezone=True))

    ip_address   = Column(String)
    user_agent   = Column(Text)

    submissions  = relationship(
        "UserData",
        back_populates="target_link",
        cascade="all, delete",
        passive_deletes=True,
    )


class UserData(Base):
    __tablename__ = "user_data"

    id          = Column(Integer, primary_key=True, index=True)
    link_id     = Column(
        String,
        ForeignKey("target_link.link_id", ondelete="CASCADE"),
        nullable=False,
    )
    email       = Column(String, nullable=False)
    nome        = Column(String, nullable=False)
    cpf         = Column(String, nullable=False)

    timestamp   = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    ip_address  = Column(String)
    user_agent  = Column(Text)

    target_link = relationship("TargetLink", back_populates="submissions")

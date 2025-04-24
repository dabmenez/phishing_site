import email
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.backend.db.base import Base

class UserData(Base):
    __tablename__ = "user_data"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    link_id = Column(String, ForeignKey("target_link.link_id"), nullable=True)
    target_link = relationship("TargetLink", back_populates="submissions")

class TargetLink(Base):
    __tablename__ = "target_link"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    link_id = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    clicked_at = Column(DateTime, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    submissions = relationship("UserData", back_populates="target_link")

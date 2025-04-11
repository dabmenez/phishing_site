from sqlalchemy import Column, Integer, String
from app.backend.db.base import Base

class UserData(Base):
    __tablename__ = "user_data"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)

# app/backend/db/schemas.py
from pydantic import BaseModel

class UserDataCreate(BaseModel):
    email: str
    password: str

class UserDataOut(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True  # Permite que o Pydantic leia dados oriundos dos modelos do SQLAlchemy

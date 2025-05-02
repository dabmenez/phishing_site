import os, pathlib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

class Base(DeclarativeBase): ...

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./db.sqlite3")

if DATABASE_URL.startswith("sqlite"):
    db_path = pathlib.Path(DATABASE_URL.replace("sqlite:///", "", 1))
    db_path.parent.mkdir(parents=True, exist_ok=True)  # cria “./” se faltar
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

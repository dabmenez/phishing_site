# app/backend/lib/utils.py
import hashlib
from datetime import datetime

def hash_password(password: str) -> str:
    """
    Cria um hash SHA-256 da senha para armazenamento seguro.
    """
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def format_datetime(dt: datetime, fmt: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Formata uma data e hora em uma string com o formato informado.
    """
    return dt.strftime(fmt)

def current_timestamp() -> str:
    """
    Retorna o timestamp atual formatado.
    """
    return format_datetime(datetime.now())

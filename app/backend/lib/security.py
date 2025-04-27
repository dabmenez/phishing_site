"""
Funções de segurança:
* Criptografia/descrição de payloads com Fernet
* Hashing SHA‑256 para anonimizar campos (IP, por exemplo)
"""

import hashlib
from typing import Final

from cryptography.fernet import Fernet, InvalidToken  # pip install cryptography

from app.backend.constants import settings

# ------------------------------------------------------------------ #
# Fernet – usa SECRET_KEY definido nas variáveis de ambiente
# ------------------------------------------------------------------ #
_SECRET: Final[bytes] = settings.secret_key.encode()
fernet: Final[Fernet] = Fernet(_SECRET)


def encrypt_bytes(data: bytes) -> bytes:
    """Criptografa bytes e devolve bytes."""
    return fernet.encrypt(data)


def decrypt_bytes(token: bytes) -> bytes:
    """Descriptografa bytes; levanta InvalidToken se algo estiver errado."""
    return fernet.decrypt(token)


def encrypt_str(text: str) -> str:
    """Criptografa string e devolve string base64."""
    return encrypt_bytes(text.encode()).decode()


def decrypt_str(token: str) -> str:
    """Descriptografa string criptografada."""
    return decrypt_bytes(token.encode()).decode()


# ------------------------------------------------------------------ #
# Hash utilitário (SHA‑256)
# ------------------------------------------------------------------ #
def sha256_hex(value: str) -> str:
    """Retorna o SHA‑256 hexadecimal de `value`."""
    return hashlib.sha256(value.encode()).hexdigest()

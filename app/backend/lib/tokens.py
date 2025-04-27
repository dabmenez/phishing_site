"""
Geração e validação de tokens UUID4 (string).
"""

import uuid
from uuid import UUID


def generate_token() -> str:
    """Retorna um UUID4 como string."""
    return str(uuid.uuid4())


def is_valid_uuid(token: str) -> bool:
    """Verifica se a string tem formato UUID4."""
    try:
        UUID(token, version=4)
    except ValueError:
        return False
    return True

# app/backend/lib/validators.py
import re

def is_valid_email(email: str) -> bool:
    """
    Valida o formato de um email.
    """
    regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
    return re.fullmatch(regex, email) is not None

def is_strong_password(password: str) -> bool:
    """
    Verifica se a senha atende a critérios de complexidade:
    - Pelo menos 8 caracteres
    - Pelo menos uma letra maiúscula
    - Pelo menos um número
    """
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True

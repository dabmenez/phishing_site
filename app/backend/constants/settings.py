# app/backend/constants/settings.py

# Configurações da Aplicação
APP_NAME = "Ativa investimentos"
APP_VERSION = "1.0.0"

# Configurações de Segurança
# OBS.: Em um cenário real, a SECRET_KEY deveria vir de uma variável de ambiente
# ou de um arquivo de configuração separado, mas para este exemplo ficamos com um valor fixo.
SECRET_KEY = "sua_chave_secreta_super_segura"
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60  # Tempo de expiração do token em minutos

# Outras constantes gerais
CONTENT_TYPE_JSON = "application/json"

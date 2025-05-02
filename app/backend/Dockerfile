# app/backend/Dockerfile
#───────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim

# ── dependências de sistema mínimas ──────────────────────────────────────────
RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc python3-dev \
 && rm -rf /var/lib/apt/lists/*

# ── diretório de trabalho ────────────────────────────────────────────────────
WORKDIR /app

# ── requirements ─────────────────────────────────────────────────────────────
COPY app/backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# ── código do backend ────────────────────────────────────────────────────────
COPY app/backend /app/app/backend

# ── garante o diretório onde o volume será montado ───────────────────────────
RUN mkdir -p /data && chmod 777 /data

# ── porta exposta ────────────────────────────────────────────────────────────
EXPOSE 8000

# ── comando de inicialização (hot-reload em dev) ─────────────────────────────
CMD ["uvicorn", "app.backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

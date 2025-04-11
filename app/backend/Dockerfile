# Dockerfile para o backend

FROM python:3.11-slim

# Instala dependências de sistema necessárias (gcc e python3-dev, por exemplo)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo de requisitos e instala as dependências Python
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código da aplicação para o contêiner
COPY . /app

# Expõe a porta que o backend utiliza (8000)
EXPOSE 8000

# Comando para iniciar a aplicação com Uvicorn. Note que usamos "app.backend.main:app"
CMD ["uvicorn", "app.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

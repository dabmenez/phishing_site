# Dockerfile para o frontend

FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependência e instala as dependências do Node
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Cria a build de produção do React
RUN npm run build

# Instala o "serve" globalmente para servir os arquivos estáticos
RUN npm install -g serve

# Expõe a porta que o frontend usará (3000)
EXPOSE 3000

# Comando para servir a build de produção
CMD ["serve", "-s", "build", "-l", "3000"]

# Phishing Collector

**Phishing Collector** é uma aplicação de teste desenvolvida para demonstrar a coleta de dados de usuários através de uma landing page – tudo isso de forma controlada para testes de phishing. O projeto possui um backend desenvolvido com **FastAPI** (utilizando SQLite para persistência) e um frontend em **React**. A aplicação pode ser executada tanto localmente quanto via Docker.

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar o Projeto](#como-executar-o-projeto)
  - [Executando Sem Docker](#executando-sem-docker)
  - [Executando Com Docker](#executando-com-docker)
- [Endpoints da API](#endpoints-da-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

O projeto **Phishing Collector** foi desenvolvido para fins de teste e demonstração de técnicas de phishing, onde o objetivo é coletar informações simples fornecidas pelos usuários (como email e senha) através de uma landing page.

> **Atenção:** O uso deste projeto é estritamente para fins educacionais e de teste. Nunca utilize essa aplicação para atividades maliciosas ou sem o consentimento explícito dos envolvidos.

## Funcionalidades

- **Coleta de Dados:** Usuários podem inserir dados através de um formulário na landing page.
- **Exposição de Dados:** O backend permite a exportação dos dados coletados por meio de uma API.
- **Documentação Interativa:** Endpoints documentados via Swagger UI (acessível em `/docs`).
- **Integração com Docker:** Fácil implantação com containers Docker para o backend (FastAPI) e frontend (React).

## Tecnologias Utilizadas

- **Backend:**
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [SQLAlchemy](https://www.sqlalchemy.org/)
  - [SQLite](https://www.sqlite.org/index.html)
  - [Uvicorn](https://www.uvicorn.org/)
- **Frontend:**
  - [React](https://reactjs.org/)
  - [Create React App](https://create-react-app.dev/)
- **Containerização:**
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)


## Endpoints da API

- **GET /**  
  Retorna uma mensagem de boas-vindas.

- **POST /landing/collect**  
  Endpoint para coletar dados do usuário.

- **GET /data/export**  
  Retorna todos os dados coletados.

> Consulte a documentação interativa em [http://localhost:8000/docs](http://localhost:8000/docs) para mais detalhes.

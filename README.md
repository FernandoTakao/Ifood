# IFOOD API

API simples em Flask para consultar restaurantes e seus alimentos, utilizando MySQL como banco de dados.

## Pré-requisitos

- Python 3
- Docker e Docker Compose

## Como executar

1. Inicie o banco de dados MySQL:

   ```bash
   docker compose up -d
   ```

   Na primeira inicialização, o Docker cria o banco, as tabelas e os dados de exemplo definidos em `database/init.sql`.

2. Crie e ative um ambiente virtual Python:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

   No Windows, use:

   ```powershell
   .venv\Scripts\activate
   ```

3. Instale as dependências:

   ```bash
   pip install Flask mysql-connector-python
   ```

4. Execute a aplicação:

   ```bash
   python app.py
   ```

5. Acesse no navegador:

   ```text
   http://localhost:5000
   ```

## Endpoints principais

- `GET /restaurantes` — lista todos os restaurantes
- `GET /restaurantes/<nome>` — busca restaurantes pelo nome
- `GET /restaurantes/<id>` — busca um restaurante pelo ID
- `GET /restaurantes/<id>/alimentos` — lista os alimentos de um restaurante
- `GET /alimentos/<nome>` — busca alimentos pelo nome

As rotas retornam todos os resultados correspondentes, sem parâmetros de query string. As buscas por nome são feitas pelo segmento `<nome>` da URL.
A interface divide os resultados localmente em páginas de 6 cards, sem enviar `page` ou `limit` para a API.

Exemplo:

```text
http://localhost:5000/restaurantes/Pizza
```

## Encerrar o banco

```bash
docker compose down
```

Para remover também os dados persistidos no volume do MySQL, execute `docker compose down -v`.

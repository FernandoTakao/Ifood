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

- `GET /restaurantes` — lista os restaurantes
- `GET /restaurantes/<id>` — busca um restaurante pelo ID
- `GET /restaurantes/<id>/alimentos` — lista os alimentos de um restaurante
- `GET /alimentos` — lista todos os alimentos

As listagens aceitam os parâmetros de paginação `page` e `limit`. Os endpoints `/restaurantes` e `/alimentos` também aceitam o parâmetro `nome` para busca.

Exemplo:

```text
http://localhost:5000/restaurantes?page=1&limit=10&nome=Pizza
```

## Encerrar o banco

```bash
docker compose down
```

Para remover também os dados persistidos no volume do MySQL, execute `docker compose down -v`.

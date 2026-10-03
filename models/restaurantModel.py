from database import get_connection


def buscar_restaurante_por_nome(nome):
    conexao = get_connection()
    cursor = conexao.cursor(dictionary=True)

    query = """
        SELECT
            r.id AS restaurante_id,
            r.nome AS restaurante_nome,
            r.descricao AS restaurante_descricao,
            r.categoria,
            r.imagem AS restaurante_imagem,

            a.id AS alimento_id,
            a.nome AS alimento_nome,
            a.descricao AS alimento_descricao,
            a.preco,
            a.imagem AS alimento_imagem

        FROM restaurantes r

        LEFT JOIN alimentos a
            ON a.restaurante_id = r.id

        WHERE r.nome LIKE %s
    """

    cursor.execute(query, (f"%{nome}%",))

    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return resultado
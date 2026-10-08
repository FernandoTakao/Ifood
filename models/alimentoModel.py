from database import get_connection


def buscar_alimentos(nome):
    conexao = get_connection()
    cursor = conexao.cursor(dictionary=True)

    query = """
        SELECT
            id,
            restaurante_id,
            nome,
            descricao,
            preco,
            imagem
        FROM alimentos
        WHERE nome LIKE %s
        ORDER BY nome
    """

    cursor.execute(query, (f"%{nome}%",))

    alimentos = cursor.fetchall()

    cursor.close()
    conexao.close()

    return alimentos

def listar_alimentos_por_restaurante(id_restaurante):
    conexao = get_connection()
    cursor = conexao.cursor(dictionary=True)

    query = """
        SELECT id, restaurante_id, nome, descricao, preco, imagem
        FROM alimentos
        WHERE restaurante_id = %s
        ORDER BY nome
    """
    cursor.execute(query, (id_restaurante,))
    alimentos = cursor.fetchall()

    cursor.close()
    conexao.close()
    return alimentos

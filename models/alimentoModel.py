from database import get_connection


def buscar_alimentos(nome, limite, offset):
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
        LIMIT %s OFFSET %s
    """

    cursor.execute(query, (f"%{nome}%", limite, offset))

    alimentos = cursor.fetchall()

    cursor.close()
    conexao.close()

    return alimentos

def contar_alimentos(nome):
    conexao = get_connection()
    cursor = conexao.cursor()

    query = """
        SELECT COUNT(*)
        FROM alimentos
        WHERE nome LIKE %s
    """

    cursor.execute(query, (f"%{nome}%",))

    total = cursor.fetchone()[0]

    cursor.close()
    conexao.close()

    return total    
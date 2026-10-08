from database import get_connection


def listar_restaurantes(nome):
    conexao = get_connection()
    cursor = conexao.cursor(dictionary=True)
    query = """
        SELECT id, nome, descricao, categoria, imagem
        FROM restaurantes
        WHERE nome LIKE %s
        ORDER BY nome
    """
    cursor.execute(query, (f"%{nome}%",))
    restaurantes = cursor.fetchall()
    cursor.close()
    conexao.close()
    return restaurantes


def buscar_restaurante_por_id(id_restaurante):
    conexao = get_connection()
    cursor = conexao.cursor(dictionary=True)
    query = """
        SELECT id, nome, descricao, categoria, imagem
        FROM restaurantes
        WHERE id = %s
    """
    cursor.execute(query, (id_restaurante,))
    restaurante = cursor.fetchone()
    cursor.close()
    conexao.close()
    return restaurante

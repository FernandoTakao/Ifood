from database import get_connection


def listar_restaurantes(nome, limite, offset):
    conexao = get_connection()
    cursor = conexao.cursor(dictionary=True)
    query = """
        SELECT id, nome, descricao, categoria, imagem
        FROM restaurantes
        WHERE nome LIKE %s
        LIMIT %s OFFSET %s
    """
    cursor.execute(query, (f"%{nome}%", limite, offset))
    restaurantes = cursor.fetchall()
    cursor.close()
    conexao.close()
    return restaurantes


def contar_restaurantes(nome):
    conexao = get_connection()
    cursor = conexao.cursor()
    query = """
        SELECT COUNT(*)
        FROM restaurantes
        WHERE nome LIKE %s
    """
    cursor.execute(query, (f"%{nome}%",))
    total = cursor.fetchone()[0]
    cursor.close()
    conexao.close()
    return total


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

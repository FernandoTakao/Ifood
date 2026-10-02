from database.connection import get_connection


def buscar_usuario_por_id(usuario_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT id, nome, email
        FROM usuarios
        WHERE id = %s
    """

    cursor.execute(query, (usuario_id,))
    usuario = cursor.fetchone()

    cursor.close()
    connection.close()

    return usuario
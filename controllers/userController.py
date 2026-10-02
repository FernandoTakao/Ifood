import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="ifood_user",
        password="ifood_password",
        database="ifood"
    )


def buscar_usuario(usuario_id):
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

    if usuario is None:
        return {"erro": "Usuário não encontrado"}, 404

    return usuario, 200
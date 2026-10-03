import mysql.connector
from mysql.connector import Error


def get_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="ifood_user",
            password="ifood_password",
            database="ifood"
        )

        if connection.is_connected():
            return connection

    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")

    return None

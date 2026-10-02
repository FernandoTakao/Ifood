from flask import Flask, jsonify
import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="ifood_user",
        password="ifood_password",
        database="ifood"
    )


app = Flask(__name__)

app.json.ensure_ascii = False 

@app.route("/usuarios/<int:usuario_id>", methods=["GET"])
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
        return jsonify({
            "erro": "Usuário não encontrado"
        }), 404

    return jsonify(usuario), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)

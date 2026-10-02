from flask import Flask, jsonify
from controllers.userController import buscar_usuario

app = Flask(__name__)

app.json.ensure_ascii = False 

@app.route("/usuarios/<int:usuario_id>", methods=["GET"])
def obter_usuario(usuario_id):
    usuario, status = buscar_usuario(usuario_id)

    return jsonify(usuario), status

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)

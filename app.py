from flask import Flask, jsonify, send_from_directory

from controllers.restaurantController import (
    buscar_alimentos_do_restaurante,
    buscar_restaurante,
    buscar_restaurante_por_id_controller,
)
from controllers.alimentoController import buscar_alimentos_controller

app = Flask(__name__)
app.json.ensure_ascii = False


@app.route("/")
def pagina_inicial():
    return send_from_directory("static", "index2.html")


@app.route("/restaurantes", methods=["GET"])
def restaurantes():
    return buscar_restaurante()


@app.route("/restaurantes/<string:nome>", methods=["GET"])
def restaurantes_por_nome(nome):
    return buscar_restaurante(nome)


@app.route("/restaurantes/<int:id_restaurante>", methods=["GET"])
def restaurante_por_id(id_restaurante):
    return buscar_restaurante_por_id_controller(id_restaurante)


@app.route("/restaurantes/<int:id_restaurante>/alimentos", methods=["GET"])
def alimentos_do_restaurante(id_restaurante):
    return buscar_alimentos_do_restaurante(id_restaurante)


@app.route("/alimentos/<string:nome>", methods=["GET"])
def alimentos_por_nome(nome):
    return buscar_alimentos_controller(nome)

if __name__ == "__main__":
    app.run(debug=True)

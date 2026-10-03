from flask import Flask

from controllers.restaurantController import buscar_restaurante
from controllers.alimentoController import buscar_alimentos_controller

app = Flask(__name__)


@app.route("/restaurantes", methods=["GET"])
def restaurantes():
    return buscar_restaurante()


@app.route("/alimentos", methods=["GET"])
def alimentos():
    return buscar_alimentos_controller()


if __name__ == "__main__":
    app.run(debug=True)
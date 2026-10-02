from flask import Flask

app = Flask(__name__)


@app.route("/teste", methods=["GET"])
def teste():
    return {"mensagem": "API funcionando!"}


if __name__ == "__main__":
    app.run(debug=True)
from flask import jsonify

from models.alimentoModel import buscar_alimentos


def buscar_alimentos_controller(nome):
    alimentos = buscar_alimentos(nome)

    return jsonify({
        "total": len(alimentos),
        "alimentos": alimentos
    })

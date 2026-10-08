from flask import jsonify

from models.alimentoModel import listar_alimentos_por_restaurante
from models.restaurantModel import (
    buscar_restaurante_por_id,
    listar_restaurantes,
)


def buscar_restaurante(nome=""):
    restaurantes = listar_restaurantes(nome)

    return jsonify({
        "total": len(restaurantes),
        "restaurantes": restaurantes,
    })


def buscar_restaurante_por_id_controller(id_restaurante):
    restaurante = buscar_restaurante_por_id(id_restaurante)
    if not restaurante:
        return jsonify({"erro": "Restaurante não encontrado"}), 404

    return jsonify(restaurante)


def buscar_alimentos_do_restaurante(id_restaurante):
    restaurante = buscar_restaurante_por_id(id_restaurante)
    if not restaurante:
        return jsonify({"erro": "Restaurante não encontrado"}), 404

    alimentos = listar_alimentos_por_restaurante(id_restaurante)

    return jsonify({
        "total": len(alimentos),
        "alimentos": alimentos,
    })

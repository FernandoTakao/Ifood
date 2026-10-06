from flask import jsonify, request

from models.alimentoModel import (
    contar_alimentos_por_restaurante,
    listar_alimentos_por_restaurante,
)
from models.restaurantModel import (
    buscar_restaurante_por_id,
    contar_restaurantes,
    listar_restaurantes,
)


def obter_paginacao():
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
    except ValueError:
        return None, jsonify({"erro": "page e limit devem ser números inteiros"}), 400

    if page < 1:
        return None, jsonify({"erro": "page deve ser maior ou igual a 1"}), 400

    if limit < 1:
        return None, jsonify({"erro": "limit deve ser maior ou igual a 1"}), 400

    return (page, limit, (page - 1) * limit), None, None


def buscar_restaurante():
    paginacao, resposta_erro, status = obter_paginacao()
    if resposta_erro:
        return resposta_erro, status

    page, limit, offset = paginacao
    nome = request.args.get("nome", "")
    restaurantes = listar_restaurantes(nome, limit, offset)
    total = contar_restaurantes(nome)

    return jsonify({
        "pagina": page,
        "limite": limit,
        "total": total,
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

    paginacao, resposta_erro, status = obter_paginacao()
    if resposta_erro:
        return resposta_erro, status

    page, limit, offset = paginacao
    alimentos = listar_alimentos_por_restaurante(id_restaurante, limit, offset)
    total = contar_alimentos_por_restaurante(id_restaurante)

    return jsonify({
        "pagina": page,
        "limite": limit,
        "total": total,
        "alimentos": alimentos,
    })

from flask import request, jsonify

from models.alimentoModel import buscar_alimentos, contar_alimentos


def buscar_alimentos_controller():
    nome = request.args.get("nome", "")

    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
    except ValueError:
        return jsonify({
            "erro": "page e limit devem ser números inteiros"
        }), 400

    if page < 1:
        return jsonify({
            "erro": "page deve ser maior ou igual a 1"
        }), 400

    if limit < 1:
        return jsonify({
            "erro": "limit deve ser maior ou igual a 1"
        }), 400

    offset = (page - 1) * limit

    alimentos = buscar_alimentos(nome, limit, offset)
    total = contar_alimentos(nome)

    return jsonify({
        "pagina": page,
        "limite": limit,
        "total": total,
        "alimentos": alimentos
    })
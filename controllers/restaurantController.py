from flask import request, jsonify

from models.restaurantModel import buscar_restaurante_por_nome


def buscar_restaurante():
    nome = request.args.get("nome")

    if not nome:
        return jsonify({
            "erro": "Informe o nome do restaurante"
        }), 400

    resultado = buscar_restaurante_por_nome(nome)

    if not resultado:
        return jsonify({
            "erro": "Restaurante não encontrado"
        }), 404

    restaurante = {
        "id": resultado[0]["restaurante_id"],
        "nome": resultado[0]["restaurante_nome"],
        "descricao": resultado[0]["restaurante_descricao"],
        "categoria": resultado[0]["categoria"],
        "imagem": resultado[0]["restaurante_imagem"],
        "alimentos": []
    }

    for linha in resultado:
        if linha["alimento_id"] is not None:
            restaurante["alimentos"].append({
                "id": linha["alimento_id"],
                "nome": linha["alimento_nome"],
                "descricao": linha["alimento_descricao"],
                "preco": linha["preco"],
                "imagem": linha["alimento_imagem"]
            })

    return jsonify(restaurante)
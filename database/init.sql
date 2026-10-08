SET NAMES utf8mb4;
USE ifood;

-- Tabela restaurantes
CREATE TABLE restaurantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    imagem VARCHAR(500)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Tabela alimentos
CREATE TABLE alimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(500),

    FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- INSERINDO DADOS PARA TESTE

-- Restaurantes
INSERT INTO restaurantes
(nome, descricao, categoria, imagem)
VALUES
(
    'Pizzaria do João',
    'Pizzas artesanais',
    'Pizza',
    'https://exemplo.com/pizzaria.jpg'
),
(
    'Burger House',
    'Hambúrgueres artesanais',
    'Hambúrguer',
    'https://exemplo.com/burger.jpg'
);


-- Alimentos
INSERT INTO alimentos
(restaurante_id, nome, descricao, preco, imagem)
VALUES
(
    1,
    'Pizza Calabresa',
    'Pizza de calabresa com queijo e cebola',
    39.90,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt7BdtOedv3Thmx12N6g-ve9RKbRemz9y0YOzncXVBVg&s=10'
),
(
    1,
    'Pizza Frango com Catupiry',
    'Pizza de frango com catupiry',
    42.90,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYUAwBYjruhGpwPckXO59nYWRx61wnwBQ0GzatwjqvoQ&s=10'
),
(
    2,
    'X-Burger',
    'Hambúrguer com queijo, alface e tomate',
    25.90,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_7GmNDgmfB_qxpE1wCQDwzSBZGoCQvnKIPXZly8ZYXQ&s=10'
),
(
    2,
    'X-Bacon',
    'Hambúrguer com queijo e bacon',
    29.90,
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbj8oPRJhbMMfeBRDEnt7rOGs8xXgXhcZQy37-W6RK0w&s=10'
);
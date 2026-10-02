SET NAMES utf8mb4;
USE ifood;

-- Tabela usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabela restaurantes
CREATE TABLE restaurantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100),
    imagem VARCHAR(500),

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
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
-- Usuários
INSERT INTO usuarios (nome, email) VALUES
('João Silva', 'joao@email.com'),
('Maria Souza', 'maria@email.com');


-- Restaurantes
INSERT INTO restaurantes
(usuario_id, nome, descricao, categoria, imagem)
VALUES
(1, 'Pizzaria do João', 'Pizzas artesanais', 'Pizza',
 'https://exemplo.com/pizzaria.jpg'),

(2, 'Burger House', 'Hambúrgueres artesanais', 'Hambúrguer',
 'https://exemplo.com/burger.jpg');


-- Alimentos
INSERT INTO alimentos
(restaurante_id, nome, descricao, preco, imagem)
VALUES
(1, 'Pizza Calabresa', 'Pizza de calabresa com queijo e cebola',
 39.90, 'https://imgs.search.brave.com/zJuJB0V5LMccxTRtdn8JXvmr9MXc8mDPK7601MO3yHI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3RpL2ZvdG9z/LWdyYXRpcy90Mi8z/MTQwMTc2LXBpenph/LWNhbGFicmVzYS1j/b20tbXVzc2FyZWxh/LXF1ZWlqby1zYWxh/bWUtcHJlc3VudG8t/Zm90by5KUEc'),

(1, 'Pizza Frango com Catupiry', 'Pizza de frango com catupiry',
 42.90, 'https://imgs.search.brave.com/aaGHFrqq3ytz_B6Hqn6tnqCeEKFw_9_kjhBoLbmeBWM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9waXp6/YS1kby1waW5oJUMz/JUEzby1kYS1nYWxp/bmhhLTU0MTg1MTA1/LmpwZw'),

(2, 'X-Burger', 'Hambúrguer com queijo, alface e tomate',
 25.90, 'https://imgs.search.brave.com/OE11VxDcT8bJEgYXcbi2fzdMbDPrQwpecDFAtNa_Sg8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L2ZvdG9zLXByZW1p/dW0vZGVsaWNpb3Nv/LWhhbWJ1cmd1ZXIt/dm9hZG9yLXNvYnJl/LXVtYS1tZXNhLWhh/bWJ1cmd1ZXItZGUt/cXVlaWpvLWNvbS1i/YWNvbl8xMjkzMjM5/LTI3NzguanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw'),

(2, 'X-Bacon', 'Hambúrguer com queijo e bacon',
 29.90, 'https://imgs.search.brave.com/VmFQY0pMKjHDInWROzZLClLb2eSvXiUMLA5lCKc1XOA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZW5zLmpvdGFqYS5j/b20vcHJvZHV0b3Mv/MjUyMC81ODdCMkE2/OEQwQjQ1NEI0MjUx/NkQ5NUNBRDFFMjE2/ODNCMUZEQThDQTk3/NjRFQjE4OTg5QjU3/MTA3MUQ3MDMzLmpw/ZWc');
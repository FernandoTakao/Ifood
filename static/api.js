/* =====================================================================
   api.js — configuração e funções de requisição HTTP (fetch)
   Todas as URLs da API ficam NESTE arquivo.
   ===================================================================== */

// URL base do servidor Flask (altere se usar outra porta/host)
const API_URL = "http://localhost:5000";

const ENDPOINTS = {
  restaurantes: `${API_URL}/restaurantes`,
  restaurante: (idRestaurante) => `${API_URL}/restaurantes/${idRestaurante}`,
  restaurantesPorNome: (nome) => `${API_URL}/restaurantes/${encodeURIComponent(nome)}`,
  produtosDoRestaurante: (idRestaurante) => `${API_URL}/restaurantes/${idRestaurante}/alimentos`,
  alimentosPorNome: (nome) => `${API_URL}/alimentos/${encodeURIComponent(nome)}`,
};

// ---------------------------------------------------------------------
// Erro padronizado para a interface
// tipo: "config" | "rede" | "http" | "json"
// ---------------------------------------------------------------------
class ApiError extends Error {
  constructor(tipo, mensagem, status = null) {
    super(mensagem);
    this.tipo = tipo;
    this.status = status;
  }
}

// Função base: chama a URL e trata erros
async function requisicao(url) {
  let resposta;
  try {
    resposta = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  } catch (e) {
    // Falha de rede, servidor desligado ou CORS bloqueado
    throw new ApiError("rede", "Não foi possível conectar à API. Verifique se o servidor Flask está executando.");
  }

  let dados = null;
  try {
    dados = await resposta.json();
  } catch (e) {
    if (resposta.ok) throw new ApiError("json", "A API respondeu, mas o conteúdo não é um JSON válido.", resposta.status);
  }

  if (!resposta.ok) {
    throw new ApiError("http", `A API retornou erro HTTP ${resposta.status}.`, resposta.status);
  }
  return dados;
}

// ---------------------------------------------------------------------
// Funções por requisição
// ---------------------------------------------------------------------

// Lista todos os restaurantes
function listarRestaurantes() {
  return requisicao(ENDPOINTS.restaurantes);
}

// Busca restaurantes por termo
function buscarRestaurantes(termo) {
  return requisicao(ENDPOINTS.restaurantesPorNome(termo));
}

function obterRestaurante(idRestaurante) {
  return requisicao(ENDPOINTS.restaurante(idRestaurante));
}

// Lista todos os produtos (cardápio) de um restaurante
function listarProdutosDoRestaurante(idRestaurante) {
  return requisicao(ENDPOINTS.produtosDoRestaurante(idRestaurante));
}

// Busca produtos por termo
function buscarProdutos(termo) {
  return requisicao(ENDPOINTS.alimentosPorNome(termo));
}

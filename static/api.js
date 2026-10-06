/* =====================================================================
   api.js — configuração e funções de requisição HTTP (fetch)
   Todas as URLs da API ficam NESTE arquivo.
   ===================================================================== */

// URL base do servidor Flask (altere se usar outra porta/host)
const API_URL = "http://localhost:5000";

const ENDPOINTS = {
  restaurantes: `${API_URL}/restaurantes`,
  restaurante: (idRestaurante) => `${API_URL}/restaurantes/${idRestaurante}`,
  produtosDoRestaurante: (idRestaurante) => `${API_URL}/restaurantes/${idRestaurante}/alimentos`,
  alimentos: `${API_URL}/alimentos`,
};

const PARAMS = {
  termo: "nome",
  pagina: "page",
  limite: "limit"
};

const ITENS_POR_PAGINA = 6;

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

// Função base: monta a URL com query string, chama fetch e trata erros
async function requisicao(url, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.set(k, v);
  });
  const urlFinal = query.toString() ? `${url}?${query}` : url;

  let resposta;
  try {
    resposta = await fetch(urlFinal, { method: "GET", headers: { Accept: "application/json" } });
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

// Lista restaurantes (com paginação)
function listarRestaurantes(pagina = 1) {
  return requisicao(ENDPOINTS.restaurantes, {
    [PARAMS.pagina]: pagina,
    [PARAMS.limite]: ITENS_POR_PAGINA,
  });
}

// Busca restaurantes por termo (com paginação)
function buscarRestaurantes(termo, pagina = 1) {
  return requisicao(ENDPOINTS.restaurantes, {
    [PARAMS.termo]: termo,
    [PARAMS.pagina]: pagina,
    [PARAMS.limite]: ITENS_POR_PAGINA,
  });
}

function obterRestaurante(idRestaurante) {
  return requisicao(ENDPOINTS.restaurante(idRestaurante));
}

// Lista os produtos (cardápio) de um restaurante (com paginação)
function listarProdutosDoRestaurante(idRestaurante, pagina = 1) {
  return requisicao(ENDPOINTS.produtosDoRestaurante(idRestaurante), {
    [PARAMS.pagina]: pagina,
    [PARAMS.limite]: ITENS_POR_PAGINA,
  });
}

// Busca produtos por termo (com paginação)
function buscarProdutos(termo, pagina = 1) {
  return requisicao(ENDPOINTS.alimentos, {
    [PARAMS.termo]: termo,
    [PARAMS.pagina]: pagina,
    [PARAMS.limite]: ITENS_POR_PAGINA,
  });
}

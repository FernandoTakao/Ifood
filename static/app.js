/* =====================================================================
   app.js — lógica da interface (usa as funções de api.js)
   ===================================================================== */

const $ = (id) => document.getElementById(id);

// Estado de cada lista: o que está sendo exibido e em qual página
const estadoRest = { modo: "todos", termo: "", pagina: 1 };
const estadoProd = { modo: null, termo: "", pagina: 1, restaurante: null };

/* ---------- Utilidades de DOM ---------- */
function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function mostrarEstado(container, tipo, mensagem) {
  container.replaceChildren();
  const caixa = el("div", `estado estado-${tipo}`);
  if (tipo === "carregando") caixa.append(el("span", "spinner"));
  caixa.append(el("p", "", mensagem));
  container.append(caixa);
}

function mensagemDeErro(erro) {
  if (erro instanceof ApiError) return erro.message;
  return "Ocorreu um erro inesperado ao processar a resposta.";
}

/* ---------- Normalização da resposta ---------- */
// A API pode devolver uma lista direta ou um objeto contendo a lista.
function extrairLista(dados) {
  if (Array.isArray(dados)) return dados;
  if (dados && typeof dados === "object") {
    const achada = Object.values(dados).find(Array.isArray);
    if (achada) return achada;
  }
  return [];
}

// Lê metadados de paginação, se a API os enviar; senão estima pelo tamanho da lista.
function lerPaginacao(dados, pagina, qtd) {
  const meta = (dados && !Array.isArray(dados) && (dados.meta || dados.pagination || dados.paginacao)) || dados || {};
  const totalPaginas = meta.pages ?? meta.total_pages ?? meta.totalPages ?? meta.paginas;
  const total = meta.total ?? meta.total_items ?? meta.count;
  let temProxima;
  if (typeof meta.has_next === "boolean") temProxima = meta.has_next;
  else if (Number.isFinite(totalPaginas)) temProxima = pagina < totalPaginas;
  else if (Number.isFinite(total)) temProxima = pagina * ITENS_POR_PAGINA < total;
  else temProxima = qtd >= ITENS_POR_PAGINA;
  return { temAnterior: pagina > 1, temProxima, totalPaginas: Number.isFinite(totalPaginas) ? totalPaginas : null };
}

/* ---------- Renderização ---------- */
const CHAVES_NOME = ["nome", "name", "titulo", "title"];
const CHAVES_PRECO = ["preco", "price", "valor"];

function formatarValor(chave, valor) {
  if (CHAVES_PRECO.includes(chave.toLowerCase()) && !isNaN(Number(valor))) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  return typeof valor === "object" ? JSON.stringify(valor) : String(valor);
}

// Cria um card com somente os campos que existem no JSON
function criarCard(item, textoBotao, aoClicar) {
  const card = el("article", "card");
  const chaveNome = CHAVES_NOME.find((k) => item[k] !== undefined);

  const topo = el("div", "card-topo");
  if (item.id !== undefined) topo.append(el("span", "badge", `ID ${item.id}`));
  card.append(topo);
  card.append(el("h3", "", chaveNome ? item[chaveNome] : "Item sem nome"));

  const dl = el("dl", "campos");
  Object.entries(item).forEach(([chave, valor]) => {
    if (chave === "id" || chave === chaveNome || valor === null || valor === "") return;
    dl.append(el("dt", "", chave), el("dd", "", formatarValor(chave, valor)));
  });
  if (dl.children.length) card.append(dl);

  if (textoBotao) {
    const btn = el("button", "btn btn-primario btn-card", textoBotao);
    btn.type = "button";
    btn.addEventListener("click", () => aoClicar(item, chaveNome ? item[chaveNome] : `#${item.id}`));
    card.append(btn);
  }
  return card;
}

function renderizarCards(container, lista, textoBotao, aoClicar) {
  container.replaceChildren();
  const grade = el("div", "grade");
  lista.forEach((item) => grade.append(criarCard(item, textoBotao, aoClicar)));
  container.append(grade);
}

function renderizarPaginacao(nav, pagina, info, aoMudar) {
  nav.replaceChildren();
  const ant = el("button", "btn btn-secundario", "Anterior");
  const prox = el("button", "btn btn-secundario", "Próxima");
  ant.type = prox.type = "button";
  ant.disabled = !info.temAnterior;
  prox.disabled = !info.temProxima;
  ant.addEventListener("click", () => aoMudar(pagina - 1));
  prox.addEventListener("click", () => aoMudar(pagina + 1));
  const rotulo = info.totalPaginas ? `Página ${pagina} de ${info.totalPaginas}` : `Página ${pagina}`;
  nav.append(ant, el("span", "pagina-atual", rotulo), prox);
}

function atualizarPainelJson() {
  if (!ultimaRequisicao) return;
  const { metodo, url, status, dados } = ultimaRequisicao;
  $("resposta-json").textContent = `${metodo} ${url}  →  HTTP ${status}\n\n${JSON.stringify(dados, null, 2)}`;
}

/* ---------- Restaurantes ---------- */
async function carregarRestaurantes() {
  const lista = $("lista-restaurantes");
  const nav = $("paginacao-restaurantes");
  nav.replaceChildren();
  mostrarEstado(lista, "carregando", "Carregando restaurantes...");
  try {
    const dados = estadoRest.modo === "busca"
      ? await buscarRestaurantes(estadoRest.termo, estadoRest.pagina)
      : await listarRestaurantes(estadoRest.pagina);
    atualizarPainelJson();
    const itens = extrairLista(dados);
    if (!itens.length) return mostrarEstado(lista, "vazio", "Nenhum restaurante encontrado.");
    renderizarCards(lista, itens, "Ver cardápio", abrirCardapio);
    renderizarPaginacao(nav, estadoRest.pagina, lerPaginacao(dados, estadoRest.pagina, itens.length), (p) => {
      estadoRest.pagina = p;
      carregarRestaurantes();
    });
  } catch (erro) {
    atualizarPainelJson();
    mostrarEstado(lista, "erro", mensagemDeErro(erro));
  }
}

/* ---------- Produtos ---------- */
function abrirCardapio(restaurante, nome) {
  Object.assign(estadoProd, { modo: "cardapio", restaurante, termo: "", pagina: 1, nomeRestaurante: nome });
  $("busca-produtos").value = "";
  carregarProdutos();
  $("secao-produtos").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function carregarProdutos() {
  const lista = $("lista-produtos");
  const nav = $("paginacao-produtos");
  nav.replaceChildren();

  $("titulo-produtos").textContent = estadoProd.modo === "cardapio"
    ? `Cardápio de ${estadoProd.nomeRestaurante}`
    : `Resultados para "${estadoProd.termo}"`;

  mostrarEstado(lista, "carregando", "Carregando produtos...");
  try {
    const dados = estadoProd.modo === "cardapio"
      ? await listarProdutosDoRestaurante(estadoProd.restaurante.id, estadoProd.pagina)
      : await buscarProdutos(estadoProd.termo, estadoProd.pagina);
    atualizarPainelJson();
    const itens = extrairLista(dados);
    if (!itens.length) return mostrarEstado(lista, "vazio", "Nenhum produto encontrado.");
    renderizarCards(lista, itens);
    renderizarPaginacao(nav, estadoProd.pagina, lerPaginacao(dados, estadoProd.pagina, itens.length), (p) => {
      estadoProd.pagina = p;
      carregarProdutos();
    });
  } catch (erro) {
    atualizarPainelJson();
    mostrarEstado(lista, "erro", mensagemDeErro(erro));
  }
}

/* ---------- Eventos ---------- */
$("form-restaurantes").addEventListener("submit", (e) => {
  e.preventDefault();
  const termo = $("busca-restaurantes").value.trim();
  Object.assign(estadoRest, termo ? { modo: "busca", termo, pagina: 1 } : { modo: "todos", termo: "", pagina: 1 });
  carregarRestaurantes();
});

$("btn-listar").addEventListener("click", () => {
  $("busca-restaurantes").value = "";
  Object.assign(estadoRest, { modo: "todos", termo: "", pagina: 1 });
  carregarRestaurantes();
});

$("form-produtos").addEventListener("submit", (e) => {
  e.preventDefault();
  const termo = $("busca-produtos").value.trim();
  if (!termo) return mostrarEstado($("lista-produtos"), "inicial", "Digite um termo para buscar produtos.");
  Object.assign(estadoProd, { modo: "busca", termo, pagina: 1, restaurante: null });
  carregarProdutos();
});

/* ---------- Estado inicial ---------- */
mostrarEstado($("lista-restaurantes"), "inicial", 'Clique em "Listar todos" ou faça uma busca para consultar a API.');
mostrarEstado($("lista-produtos"), "inicial", 'Escolha "Ver cardápio" em um restaurante ou busque produtos por termo.');

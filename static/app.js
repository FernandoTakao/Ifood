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

/* ---------- Paginação ---------- */
function lerPaginacao(dados) {
  const total = Number(dados.total);
  const limite = Number(dados.limite);
  const totalPaginas = Number.isFinite(total) ? Math.ceil(total / limite) : 0;
  return {
    temAnterior: dados.pagina > 1,
    temProxima: dados.pagina < totalPaginas,
    totalPaginas,
  };
}

/* ---------- Renderização ---------- */
function criarCard(item, textoBotao, aoClicar) {
  const card = el("article", "card");

  const topo = el("div", "card-topo");
  if (item.id !== undefined) topo.append(el("span", "badge", `ID ${item.id}`));
  card.append(topo);
  card.append(el("h3", "", item.nome || "Item sem nome"));

  const dl = el("dl", "campos");
  Object.entries(item).forEach(([chave, valor]) => {
    if (chave === "id" || chave === "nome" || valor === null || valor === "") return;
    const texto = chave === "preco"
      ? Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : String(valor);
    dl.append(el("dt", "", chave), el("dd", "", texto));
  });
  if (dl.children.length) card.append(dl);

  if (textoBotao) {
    const btn = el("button", "btn btn-primario btn-card", textoBotao);
    btn.type = "button";
    btn.addEventListener("click", () => aoClicar(item));
    card.append(btn);
  }
  return card;
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
    const itens = dados.restaurantes;
    if (!itens.length) return mostrarEstado(lista, "vazio", "Nenhum restaurante encontrado.");
    lista.replaceChildren();
    const grade = el("div", "grade");
    itens.forEach((item) => grade.append(criarCard(item, "Ver cardápio", abrirCardapio)));
    lista.append(grade);
    renderizarPaginacao(nav, dados.pagina, lerPaginacao(dados), (p) => {
      estadoRest.pagina = p;
      carregarRestaurantes();
    });
  } catch (erro) {
    mostrarEstado(lista, "erro", erro.message || "Ocorreu um erro inesperado.");
  }
}

/* ---------- Produtos ---------- */
async function abrirCardapio(restaurante) {
  const perfil = $("perfil-restaurante");
  perfil.replaceChildren();
  try {
    const restauranteCompleto = await obterRestaurante(restaurante.id);
    perfil.append(criarCard(restauranteCompleto));
    Object.assign(estadoProd, {
      modo: "cardapio",
      restaurante: restauranteCompleto,
      termo: "",
      pagina: 1,
      nomeRestaurante: restauranteCompleto.nome,
    });
  } catch (erro) {
    mostrarEstado(perfil, "erro", erro.message || "Ocorreu um erro inesperado.");
    return;
  }
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
    const itens = dados.alimentos;
    if (!itens.length) return mostrarEstado(lista, "vazio", "Nenhum produto encontrado.");
    lista.replaceChildren();
    const grade = el("div", "grade");
    itens.forEach((item) => grade.append(criarCard(item)));
    lista.append(grade);
    renderizarPaginacao(nav, dados.pagina, lerPaginacao(dados), (p) => {
      estadoProd.pagina = p;
      carregarProdutos();
    });
  } catch (erro) {
    mostrarEstado(lista, "erro", erro.message || "Ocorreu um erro inesperado.");
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

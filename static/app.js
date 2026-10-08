/* =====================================================================
   app.js — lógica da interface (usa as funções de api.js)
   ===================================================================== */

const $ = (id) => document.getElementById(id);

const ITENS_POR_PAGINA = 6;
const estadoRest = { modo: "todos", termo: "", pagina: 1, itens: [] };
const estadoProd = { modo: null, termo: "", restaurante: null, pagina: 1, itens: [] };

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

/* ---------- Renderização ---------- */
function criarCard(item, textoBotao, aoClicar) {
  const card = el("article", "card");

  if (item.imagem) {
    const imagem = el("img", "card-imagem");
    imagem.src = item.imagem;
    imagem.alt = item.nome ? `Imagem de ${item.nome}` : "Imagem do item";
    imagem.loading = "lazy";
    imagem.addEventListener("error", () => imagem.remove());
    card.append(imagem);
  }

  const topo = el("div", "card-topo");
  if (item.id !== undefined) topo.append(el("span", "badge", `ID ${item.id}`));
  card.append(topo);
  card.append(el("h3", "", item.nome || "Item sem nome"));

  const dl = el("dl", "campos");
  Object.entries(item).forEach(([chave, valor]) => {
    if (chave === "id" || chave === "nome" || chave === "imagem" || valor === null || valor === "") return;
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

function renderizarPaginacao(nav, pagina, totalItens, aoMudar) {
  nav.replaceChildren();
  const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);
  if (totalPaginas <= 1) return;

  const anterior = el("button", "btn btn-secundario", "Anterior");
  const proxima = el("button", "btn btn-secundario", "Próxima");
  anterior.type = proxima.type = "button";
  anterior.disabled = pagina === 1;
  proxima.disabled = pagina === totalPaginas;
  anterior.addEventListener("click", () => aoMudar(pagina - 1));
  proxima.addEventListener("click", () => aoMudar(pagina + 1));
  nav.append(anterior, el("span", "pagina-atual", `Página ${pagina} de ${totalPaginas}`), proxima);
}

function itensDaPagina(itens, pagina) {
  const inicio = (pagina - 1) * ITENS_POR_PAGINA;
  return itens.slice(inicio, inicio + ITENS_POR_PAGINA);
}

function exibirRestaurantes() {
  const lista = $("lista-restaurantes");
  const nav = $("paginacao-restaurantes");
  lista.replaceChildren();
  const grade = el("div", "grade");
  itensDaPagina(estadoRest.itens, estadoRest.pagina)
    .forEach((item) => grade.append(criarCard(item, "Ver cardápio", abrirCardapio)));
  lista.append(grade);
  renderizarPaginacao(nav, estadoRest.pagina, estadoRest.itens.length, (pagina) => {
    estadoRest.pagina = pagina;
    exibirRestaurantes();
  });
}

function exibirProdutos() {
  const lista = $("lista-produtos");
  const nav = $("paginacao-produtos");
  lista.replaceChildren();
  const grade = el("div", "grade");
  itensDaPagina(estadoProd.itens, estadoProd.pagina)
    .forEach((item) => grade.append(criarCard(item)));
  lista.append(grade);
  renderizarPaginacao(nav, estadoProd.pagina, estadoProd.itens.length, (pagina) => {
    estadoProd.pagina = pagina;
    exibirProdutos();
  });
}

/* ---------- Restaurantes ---------- */
async function carregarRestaurantes() {
  const lista = $("lista-restaurantes");
  $("paginacao-restaurantes").replaceChildren();
  mostrarEstado(lista, "carregando", "Carregando restaurantes...");
  try {
    const dados = estadoRest.modo === "busca"
      ? await buscarRestaurantes(estadoRest.termo)
      : await listarRestaurantes();
    const itens = dados.restaurantes;
    if (!itens.length) return mostrarEstado(lista, "vazio", "Nenhum restaurante encontrado.");
    estadoRest.itens = itens;
    exibirRestaurantes();
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
  $("paginacao-produtos").replaceChildren();

  $("titulo-produtos").textContent = estadoProd.modo === "cardapio"
    ? `Cardápio de ${estadoProd.nomeRestaurante}`
    : `Resultados para "${estadoProd.termo}"`;

  mostrarEstado(lista, "carregando", "Carregando produtos...");
  try {
    const dados = estadoProd.modo === "cardapio"
      ? await listarProdutosDoRestaurante(estadoProd.restaurante.id)
      : await buscarProdutos(estadoProd.termo);
    const itens = dados.alimentos;
    if (!itens.length) return mostrarEstado(lista, "vazio", "Nenhum produto encontrado.");
    estadoProd.itens = itens;
    exibirProdutos();
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
  Object.assign(estadoProd, { modo: "busca", termo, restaurante: null, pagina: 1 });
  carregarProdutos();
});

/* ---------- Estado inicial ---------- */
mostrarEstado($("lista-restaurantes"), "inicial", 'Clique em "Listar todos" ou faça uma busca para consultar a API.');
mostrarEstado($("lista-produtos"), "inicial", 'Escolha "Ver cardápio" em um restaurante ou busque produtos por termo.');

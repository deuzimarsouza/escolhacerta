const products = [
  {
    id: "fone-bluetooth-pro",
    title: "Fone bluetooth com cancelamento de ruído",
    category: "Tecnologia",
    price: 349.9,
    oldPrice: 499.9,
    badge: "Mais buscado",
    date: "2026-05-18",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/fone-bluetooth-pro?tag=escolhacerta",
    excerpt:
      "Boa opção para quem trabalha em chamada, viaja com frequência e quer foco sem gastar demais.",
    highlights: ["Bateria de longa duração", "Microfone claro", "Conforto para uso diário"],
  },
  {
    id: "smartwatch-fit",
    title: "Smartwatch fitness com monitor cardíaco",
    category: "Tecnologia",
    price: 229.9,
    oldPrice: 299.9,
    badge: "Custo-benefício",
    date: "2026-05-12",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/smartwatch-fit?tag=escolhacerta",
    excerpt:
      "Modelo equilibrado para acompanhar sono, passos, batimentos e notificações do celular.",
    highlights: ["Tela nítida", "Resistente à água", "Modos de treino"],
  },
  {
    id: "air-fryer-digital",
    title: "Air fryer digital de 5 litros",
    category: "Casa",
    price: 399.9,
    oldPrice: 529.9,
    badge: "Mais vendido",
    date: "2026-05-22",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/air-fryer-digital?tag=escolhacerta",
    excerpt:
      "Capacidade boa para rotina familiar, painel simples e preparo rápido para refeições do dia a dia.",
    highlights: ["Cesto amplo", "Painel digital", "Fácil de limpar"],
  },
  {
    id: "aspirador-robo",
    title: "Aspirador robô com retorno automático",
    category: "Casa",
    price: 699.9,
    oldPrice: 899.9,
    badge: "Oferta forte",
    date: "2026-04-30",
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/aspirador-robo?tag=escolhacerta",
    excerpt:
      "Indicado para manutenção diária em pisos frios, madeira e ambientes com circulação constante.",
    highlights: ["Base automática", "Perfil baixo", "Rotina programável"],
  },
  {
    id: "cadeira-ergonomica",
    title: "Cadeira ergonômica para home office",
    category: "Escritório",
    price: 849.9,
    oldPrice: 1049.9,
    badge: "Home office",
    date: "2026-05-08",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/cadeira-ergonomica?tag=escolhacerta",
    excerpt:
      "Boa para longas jornadas, com ajustes de altura, apoio lombar e encosto respirável.",
    highlights: ["Apoio lombar", "Braços ajustáveis", "Tela respirável"],
  },
  {
    id: "mochila-executiva",
    title: "Mochila executiva impermeável",
    category: "Escritório",
    price: 159.9,
    oldPrice: 219.9,
    badge: "Organização",
    date: "2026-04-25",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/mochila-executiva?tag=escolhacerta",
    excerpt:
      "Compartimentos úteis para notebook, carregadores, documentos e acessórios de trabalho.",
    highlights: ["Bolso para notebook", "Tecido resistente", "Design discreto"],
  },
  {
    id: "kit-skincare",
    title: "Kit skincare básico para rotina diurna",
    category: "Beleza",
    price: 119.9,
    oldPrice: 159.9,
    badge: "Rotina leve",
    date: "2026-05-14",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/kit-skincare?tag=escolhacerta",
    excerpt:
      "Seleção enxuta para limpeza, hidratação e proteção, sem complicar o cuidado diário.",
    highlights: ["Textura leve", "Uso diário", "Bom rendimento"],
  },
  {
    id: "tenis-running",
    title: "Tênis running com amortecimento",
    category: "Esporte",
    price: 279.9,
    oldPrice: 379.9,
    badge: "Treino leve",
    date: "2026-05-02",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/tenis-running?tag=escolhacerta",
    excerpt:
      "Modelo versátil para caminhadas, academia e corridas curtas em ritmo confortável.",
    highlights: ["Pisada estável", "Cabedal respirável", "Solado aderente"],
  },
  {
    id: "cafeteira-capsulas",
    title: "Cafeteira de cápsulas compacta",
    category: "Casa",
    price: 319.9,
    oldPrice: 429.9,
    badge: "Compacta",
    date: "2026-04-19",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/cafeteira-capsulas?tag=escolhacerta",
    excerpt:
      "Ocupa pouco espaço e entrega bebidas rápidas para quem quer praticidade pela manhã.",
    highlights: ["Aquecimento rápido", "Reservatório removível", "Pouco espaço"],
  },
];

const state = {
  category: "Todos",
  query: "",
  sort: "price",
};

const favorites = new Set(JSON.parse(localStorage.getItem("favoriteProducts") || "[]"));
const productGrid = document.querySelector("#productGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resultsCount = document.querySelector("#resultsCount");
const clearFilters = document.querySelector("#clearFilters");
const toast = document.querySelector("#toast");
const dialog = document.querySelector("#productDialog");
const dialogContent = document.querySelector("#dialogContent");
const dialogClose = document.querySelector("#dialogClose");
const menuToggle = document.querySelector("#menuToggle");
const siteNav = document.querySelector("#siteNav");

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function normalize(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function renderCategories() {
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];

  categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-button"
          type="button"
          data-category="${category}"
          aria-pressed="${state.category === category}"
        >
          ${category}
        </button>
      `,
    )
    .join("");
}

function getVisibleProducts() {
  const query = normalize(state.query);

  return products
    .filter((product) => {
      const matchesCategory =
        state.category === "Todos" || product.category === state.category;
      const searchable = normalize(
        `${product.title} ${product.category} ${product.excerpt} ${product.highlights.join(" ")}`,
      );
      return matchesCategory && searchable.includes(query);
    })
    .sort((first, second) => {
      if (state.sort === "recent") {
        return new Date(second.date) - new Date(first.date);
      }

      return first.price - second.price;
    });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  resultsCount.textContent = `${visibleProducts.length} ${
    visibleProducts.length === 1 ? "produto encontrado" : "produtos encontrados"
  }`;

  if (!visibleProducts.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        Nenhum produto combina com os filtros atuais.
      </div>
    `;
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map((product) => {
      const isFavorite = favorites.has(product.id);

      return `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            <span class="badge">${product.badge}</span>
            <button
              class="icon-button favorite-button ${isFavorite ? "is-active" : ""}"
              type="button"
              data-action="favorite"
              data-id="${product.id}"
              aria-label="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
            >
              <i data-lucide="heart"></i>
            </button>
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
            </div>
            <h3>${product.title}</h3>
            <p>${product.excerpt}</p>
            <div class="product-tags">
              ${product.highlights.map((highlight) => `<span>${highlight}</span>`).join("")}
            </div>
            <div class="price-row">
              <strong class="price">${currency.format(product.price)}</strong>
              <span class="old-price">${currency.format(product.oldPrice)}</span>
            </div>
            <div class="card-actions">
              <a
                class="button button-primary"
                href="${product.link}"
                target="_blank"
                rel="nofollow sponsored noopener"
                data-action="offer"
                data-id="${product.id}"
              >
                <i data-lucide="external-link"></i>
                Ver oferta
              </a>
              <button
                class="icon-button details-button"
                type="button"
                data-action="details"
                data-id="${product.id}"
                aria-label="Ver detalhes de ${product.title}"
              >
                <i data-lucide="file-text"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  createIcons();
}

function updateView() {
  renderCategories();
  renderProducts();
}

function findProduct(id) {
  return products.find((product) => product.id === id);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2800);
}

function showProductDialog(product) {
  dialogContent.innerHTML = `
    <div class="dialog-layout">
      <img src="${product.image}" alt="${product.title}" />
      <div class="dialog-copy">
        <p class="eyebrow">${product.category}</p>
        <h2>${product.title}</h2>
        <p>${product.excerpt}</p>
        <ul class="dialog-list">
          ${product.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
        </ul>
        <div class="price-row">
          <strong class="price">${currency.format(product.price)}</strong>
          <span class="old-price">${currency.format(product.oldPrice)}</span>
        </div>
        <a
          class="button button-primary"
          href="${product.link}"
          target="_blank"
          rel="nofollow sponsored noopener"
          data-action="offer"
          data-id="${product.id}"
        >
          <i data-lucide="external-link"></i>
          Ver oferta
        </a>
      </div>
    </div>
  `;

  dialog.showModal();
  createIcons();
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  state.category = button.dataset.category;
  updateView();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

clearFilters.addEventListener("click", () => {
  state.category = "Todos";
  state.query = "";
  state.sort = "price";
  searchInput.value = "";
  sortSelect.value = "price";
  updateView();
});

productGrid.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");

  if (!target) return;

  const product = findProduct(target.dataset.id);

  if (!product) return;

  if (target.dataset.action === "favorite") {
    if (favorites.has(product.id)) {
      favorites.delete(product.id);
      showToast("Produto removido dos favoritos.");
    } else {
      favorites.add(product.id);
      showToast("Produto salvo nos favoritos.");
    }

    localStorage.setItem("favoriteProducts", JSON.stringify([...favorites]));
    renderProducts();
  }

  if (target.dataset.action === "details") {
    showProductDialog(product);
  }

  if (target.dataset.action === "offer") {
    showToast(`Abrindo oferta: ${product.title}`);
  }
});

dialog.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action='offer']");

  if (target) {
    const product = findProduct(target.dataset.id);
    showToast(`Abrindo oferta: ${product.title}`);
  }
});

dialogClose.addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", isOpen.toString());
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuToggle.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
  createIcons();
});

siteNav.addEventListener("click", () => {
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  menuToggle.innerHTML = '<i data-lucide="menu"></i>';
  createIcons();
});

updateView();
createIcons();

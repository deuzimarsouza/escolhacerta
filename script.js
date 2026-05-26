const products = [
  {
    title: "Samsung Galaxy S25 FE 5G 128GB Jetblack",
    price: "R$ 2.776,56",
    installments: "10x sem juros",
    description:
      "Smartphone 5G com 8GB de RAM, tela grande de 6.7 polegadas e camera tripla de 50MP.",
    image: "https://http2.mlstatic.com/D_NQ_NP_840870-MLA96785958150_112025-O.webp",
    link:
      "https://www.mercadolivre.com.br/celular-samsung-galaxy-s25-fe-5g-128gb-8gb-ram-cmera-tripla-de-50128-tela-grande-de-67-jetblack/p/MLB61692896?pdp_filters=item_id%3AMLB6087231690&matt_tool=38524122#origin=share&sid=share&wid=MLB6087231690&action=copy",
    category: "celulares",
    badge: "Frete gratis",
  },
  {
    title: "Samsung Galaxy S25 FE 5G 128GB Azul",
    price: "R$ 2.999",
    installments: "10x sem juros",
    description:
      "Modelo desbloqueado, compativel com 5G, tela Dynamic AMOLED 2X e bateria de 4.900 mAh.",
    image: "https://http2.mlstatic.com/D_NQ_NP_946553-MLA97120123671_112025-O.webp",
    link:
      "https://www.mercadolivre.com.br/celular-samsung-galaxy-s25-fe-5g-128gb-8gb-ram-cmera-tripla-de-50128-tela-grande-de-67-azul/p/MLB61654659?matt_tool=18956390&utm_source=google_shopping&utm_medium=organic&pdp_filters=item_id%3AMLB5898392162&from=gshop",
    category: "celulares",
    badge: "Mais vendido",
  },
  {
    title: "Samsung Galaxy S25 5G 256GB Icyblue Recondicionado",
    price: "R$ 3.539",
    installments: "12x sem juros",
    description:
      "Celular recondicionado em bom estado, com 256GB, 12GB de RAM e tela sem detalhes.",
    image: "https://http2.mlstatic.com/D_NQ_NP_715921-MLA109035229828_032026-O.webp",
    link:
      "https://www.mercadolivre.com.br/samsung-galaxy-s25-256g-icyblue-bom-recondicionado/p/MLB2004988056?matt_tool=18956390&utm_source=google_shopping&utm_medium=organic&pdp_filters=item_id%3AMLB5743026728&from=gshop",
    category: "celulares",
    badge: "Oferta",
  },
  {
    title: "Notebook Gaming 3i i5 8GB 256GB SSD",
    price: "R$ 2.899",
    installments: "21x sem juros",
    description:
      "Notebook gamer com Intel Core i5, SSD de 256GB e tela Full HD para estudo, trabalho e jogos.",
    image: "https://http2.mlstatic.com/D_661512-MLB90738168003_082025-O.webp",
    link:
      "https://produto.mercadolivre.com.br/MLB-4170996829-notebook-gaming-3i-i5-10300h-8gb-256gb-ssd-chameleon-blue-_JM",
    category: "informatica",
    badge: "Ultimo disponivel",
  },
  {
    title: "Arandela Bluetooth para som ambiente",
    price: "R$ 372,31",
    installments: "7x sem juros",
    description:
      "Alto-falante com Bluetooth, potencia de 70W e instalacao para parede, teto ou piso.",
    image: "https://http2.mlstatic.com/D_NQ_NP_883691-MLB111694979119_052026-OO.png",
    link:
      "https://www.mercadolivre.com.br/arandela-redonda-som-ambiente-alto-falante-auto-bluetooth/up/MLBU3005185007",
    category: "audio",
    badge: "25% OFF",
  },
  {
    title: "Kit 5 cases para fone de ouvido",
    price: "R$ 29,90",
    installments: "Envio para todo o pais",
    description:
      "Estojo em EVA para guardar fones KZ, QKZ, Shure, JBL e modelos similares com mais protecao.",
    image: "https://http2.mlstatic.com/D_NQ_NP_974780-MLB110327263553_042026-O.webp",
    link:
      "https://produto.mercadolivre.com.br/MLB-6605638110-kit-5-case-estojo-bolsa-fone-de-ouvido-kz-qkz-shure-jbl-_JM?matt_tool=18956390",
    category: "acessorios",
    badge: "Novo",
  },
];

const grid = document.querySelector("#products-grid");
const productCount = document.querySelector("#product-count");
const emptyState = document.querySelector("#empty-state");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const categoryButtons = document.querySelectorAll(".category");

let activeCategory = "todos";

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });

const renderProducts = () => {
  const query = normalize(searchInput.value.trim());
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "todos" || product.category === activeCategory;
    const searchableText = normalize(`${product.title} ${product.description} ${product.badge}`);
    const matchesSearch = query.length === 0 || searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = filteredProducts
    .map((product) => {
      const title = escapeHtml(product.title);
      const link = escapeHtml(product.link);
      const image = escapeHtml(product.image);
      const badge = escapeHtml(product.badge);
      const price = escapeHtml(product.price);
      const installments = escapeHtml(product.installments);
      const description = escapeHtml(product.description);

      return `
        <article class="product-card">
          <a class="product-card__link" href="${link}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${title} no Mercado Livre">
          <div class="product-card__media">
              <img src="${image}" alt="${title}" loading="lazy">
          </div>
          <div class="product-card__body">
              <span class="badge">${badge}</span>
              <h3 class="product-card__title">${title}</h3>
            <div class="price">
                <span class="price__value">${price}</span>
                <span class="price__installments">${installments}</span>
            </div>
              <p class="product-card__description">${description}</p>
          </div>
          </a>
          <div class="product-card__actions">
            <a class="product-card__cta" href="${link}" target="_blank" rel="noopener noreferrer">Ver produto</a>
            <button class="share-button" type="button" data-link="${link}" data-title="${title}" aria-label="Compartilhar link de afiliado de ${title}">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 16.1c-.8 0-1.5.3-2 .8L8.9 12.8c.1-.3.1-.5.1-.8s0-.5-.1-.8L16 7.1c.5.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .3 0 .5.1.8L8 9.8C7.5 9.3 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.5-.1.7 0 1.6 1.3 2.9 3 2.9s3-1.3 3-3-1.3-2.9-3-2.9z"/>
              </svg>
              <span class="share-button__text">Compartilhar</span>
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  productCount.textContent =
    filteredProducts.length === 1 ? "1 produto encontrado" : `${filteredProducts.length} produtos encontrados`;
  emptyState.hidden = filteredProducts.length > 0;
};

const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      // Alguns navegadores bloqueiam a API moderna; o fallback abaixo cobre esse caso.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    textarea.remove();
  }
};

const showShareFeedback = (button, message) => {
  const text = button.querySelector(".share-button__text");
  if (!text) return;

  window.clearTimeout(button.feedbackTimeout);
  text.textContent = message;
  button.classList.add("is-copied");

  button.feedbackTimeout = window.setTimeout(() => {
    text.textContent = "Compartilhar";
    button.classList.remove("is-copied");
  }, 1800);
};

const shareProduct = async (button) => {
  const link = button.dataset.link;
  const title = button.dataset.title;
  const shareData = {
    title,
    text: `Olha esse achadinho: ${title}`,
    url: link,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showShareFeedback(button, "Compartilhado");
      return;
    }

    await copyToClipboard(link);
    showShareFeedback(button, "Link copiado");
  } catch (error) {
    if (error.name === "AbortError") return;

    await copyToClipboard(link);
    showShareFeedback(button, "Link copiado");
  }
};

grid.addEventListener("click", (event) => {
  const shareButton = event.target.closest(".share-button");

  if (!shareButton) return;

  event.preventDefault();
  event.stopPropagation();
  shareProduct(shareButton);
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeCategory = button.dataset.category;
    renderProducts();
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderProducts();
});

searchInput.addEventListener("input", () => {
  renderProducts();
});

renderProducts();

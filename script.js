const products = [
  {
    searchId: "Fifine-SC3",
    id: "65C9VX-E1LB",
    title: "Fifine Gaming Mixer Ampligame SC3 - Preto",
    category: "Tecnologia",
    price: 299.9,
    oldPrice: 419.9,
    date: "2026-05-30",
    image:
      "src/fifine_sc3/fifinesc3_01.jpg",
    link: "https://meli.la/3227WYY",
    excerpt:
      "A Fifine SC3 é uma interface de áudio compacta para quem usa fones, microfones e equipamentos de som no dia a dia. Possui conexão USB-C e é compatível com alimentação USB, facilitando o uso em computadores e setups simples. Conta com 4 canais, equalizador e alimentação fantasma, ideal para melhorar a qualidade de áudio. Inclui efeitos como reverb, delay, pitch e chorus, permitindo ajustar a voz de forma prática. Tem conectores USB, XLR e P2/Jack, oferecendo boa flexibilidade para diferentes acessórios. É uma ótima opção para jogos, lives, chamadas, gravações e criação de conteúdo com mais controle sonoro.",
  },
];

const state = {
  category: "Todos",
  query: "",
  sort: "price",
};

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const categorySelect = document.querySelector("#categorySelect");
const resultsCount = document.querySelector("#resultsCount");
const toast = document.querySelector("#toast");
const dialog = document.querySelector("#productDialog");
const dialogContent = document.querySelector("#dialogContent");
const dialogClose = document.querySelector("#dialogClose");
const menuToggle = document.querySelector("#menuToggle");
const siteNav = document.querySelector("#siteNav");
const notifyButton = document.querySelector("#notifyButton");
const notificationPrompt = document.querySelector("#notificationPrompt");
const notificationPromptAllow = document.querySelector("#notificationPromptAllow");
const notificationPromptClose = document.querySelector("#notificationPromptClose");

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const PRODUCT_IDS_STORAGE_KEY = "knownProductIds";
const NOTIFICATIONS_ENABLED_KEY = "productNotificationsEnabled";
const SELLER_WHATSAPP_NUMBER = "5585996402960";

const topDiscountProductIds = new Set(
  [...products]
    .sort((first, second) => getDiscountPercent(second) - getDiscountPercent(first))
    .slice(0, 3)
    .map((product) => product.searchId),
);

function createIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function getDiscountPercent(product) {
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

function normalize(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function renderCategorySelect() {
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];

  categorySelect.innerHTML = categories
    .map(
      (category) => `
        <option value="${category}" ${state.category === category ? "selected" : ""}>
          ${category}
        </option>
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
        `${product.title} ${product.category} ${product.id} ${product.searchId} ${product.excerpt}`,
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
      const discountPercent = getDiscountPercent(product);
      const isTopDiscount = topDiscountProductIds.has(product.searchId);

      return `
        <article
          class="product-card"
          data-action="details"
          data-product-key="${product.searchId}"
          tabindex="0"
          aria-label="Ver detalhes de ${product.title}"
        >
          <div class="product-media">
            <button
              class="product-image-button"
              type="button"
              data-action="details"
              data-product-key="${product.searchId}"
              aria-label="Ver detalhes de ${product.title}"
            >
              <img src="${product.image}" alt="${product.title}" loading="lazy" />
            </button>
            ${
              isTopDiscount
                ? `<span class="discount-flame" title="${discountPercent}% OFF" aria-label="Produto com maior desconto: ${discountPercent}% OFF">
                    <i data-lucide="flame"></i>
                  </span>`
                : ""
            }
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
            </div>
            <h3>${product.title}</h3>
            <div class="product-id-row">
              <code>ID: ${product.id}</code>
              <button
                class="icon-button copy-id-button"
                type="button"
                data-action="copy-id"
                data-product-key="${product.searchId}"
                aria-label="Copiar ID ${product.id}"
              >
                <i data-lucide="copy"></i>
              </button>
            </div>
            <button
              class="product-description"
              type="button"
              data-action="details"
              data-product-key="${product.searchId}"
              aria-label="Ver descrição completa de ${product.title}"
            >
              ${product.excerpt}
            </button>
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
                data-product-key="${product.searchId}"
              >
                <i data-lucide="external-link"></i>
                Ver oferta
              </a>
              <button
                class="icon-button details-button"
                type="button"
                data-action="details"
                data-product-key="${product.searchId}"
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
  renderCategorySelect();
  renderProducts();
}

function findProduct(productKey) {
  return products.find((product) => product.searchId === productKey);
}

function getProductWhatsappLink(product) {
  const message = [
    "Olá! Vim pelo blog Escolha Certa.",
    `Quero saber mais sobre este produto: ${product.title}.`,
    `ID do produto: ${product.id}.`,
  ].join(" ");

  return `https://wa.me/${SELLER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2800);
}

function getStoredProductIds() {
  try {
    const productIds = JSON.parse(localStorage.getItem(PRODUCT_IDS_STORAGE_KEY) || "null");
    return Array.isArray(productIds) ? productIds : null;
  } catch {
    return null;
  }
}

function getProductNotificationOptions(newProducts) {
  const singleProduct = newProducts.length === 1 ? newProducts[0] : null;

  return {
    title: singleProduct ? `Novo produto: ${singleProduct.title}` : "Novos produtos na Escolha Certa",
    body: singleProduct
      ? `${singleProduct.category} por ${currency.format(singleProduct.price)}`
      : `${newProducts.length} novos produtos foram adicionados à vitrine.`,
    icon: "./assets/icon-192.png",
    tag: "new-products",
    data: {
      url: "./#produtos",
    },
  };
}

async function showProductNotification(newProducts) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const { title, ...options } = getProductNotificationOptions(newProducts);

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, options);
    return;
  }

  new Notification(title, options);
}

function updateNotificationButton() {
  if (!notifyButton) return;

  if (!("Notification" in window)) {
    notifyButton.disabled = true;
    notifyButton.setAttribute("aria-label", "Alertas indisponíveis neste navegador");
    notifyButton.innerHTML = '<i data-lucide="bell-off"></i>';
    createIcons();
    return;
  }

  const enabled =
    localStorage.getItem(NOTIFICATIONS_ENABLED_KEY) === "true" &&
    Notification.permission === "granted";

  notifyButton.setAttribute("aria-pressed", enabled.toString());
  notifyButton.setAttribute(
    "aria-label",
    enabled ? "Alertas de novos produtos ativados" : "Ativar alertas de novos produtos",
  );
  notifyButton.innerHTML = `<i data-lucide="${enabled ? "bell-ring" : "bell"}"></i>`;
  createIcons();
}

function showNotificationPrompt() {
  if (!notificationPrompt || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    notificationPrompt.hidden = true;
    return;
  }

  notificationPrompt.hidden = false;
  createIcons();
}

function hideNotificationPrompt() {
  if (notificationPrompt) {
    notificationPrompt.hidden = true;
  }
}

async function enableProductNotifications({ quiet = false } = {}) {
  if (!("Notification" in window)) {
    if (!quiet) showToast("Este navegador não oferece alertas de sistema.");
    updateNotificationButton();
    return;
  }

  if (Notification.permission === "denied") {
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "false");
    showNotificationPrompt();
    if (!quiet) showToast("Os alertas estão bloqueados nas permissões do navegador.");
    updateNotificationButton();
    return;
  }

  let permission = Notification.permission;

  try {
    permission =
      Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();
  } catch {
    permission = Notification.permission;
  }

  if (permission !== "granted") {
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "false");
    showNotificationPrompt();
    if (!quiet) showToast("Alertas de novos produtos não foram ativados.");
    updateNotificationButton();
    return;
  }

  localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "true");
  localStorage.setItem(
    PRODUCT_IDS_STORAGE_KEY,
    JSON.stringify(products.map((product) => product.searchId)),
  );
  hideNotificationPrompt();
  if (!quiet) showToast("Alertas de novos produtos ativados.");
  updateNotificationButton();
}

function requestNotificationPermissionOnAccess() {
  if (!("Notification" in window)) {
    updateNotificationButton();
    return;
  }

  if (Notification.permission === "granted") {
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "true");
    updateNotificationButton();
    return;
  }

  showNotificationPrompt();

  if (Notification.permission === "default") {
    enableProductNotifications({ quiet: true });
  }
}

function checkForNewProducts() {
  const knownProductIds = getStoredProductIds();
  const currentProductIds = products.map((product) => product.searchId);

  if (!knownProductIds) {
    localStorage.setItem(PRODUCT_IDS_STORAGE_KEY, JSON.stringify(currentProductIds));
    return;
  }

  const newProducts = products.filter((product) => !knownProductIds.includes(product.searchId));
  localStorage.setItem(PRODUCT_IDS_STORAGE_KEY, JSON.stringify(currentProductIds));

  if (
    !newProducts.length ||
    localStorage.getItem(NOTIFICATIONS_ENABLED_KEY) !== "true" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  showProductNotification(newProducts);
  showToast(
    newProducts.length === 1
      ? `Novo produto: ${newProducts[0].title}`
      : `${newProducts.length} novos produtos adicionados.`,
  );
}

function showProductDialog(product) {
  const whatsappLink = getProductWhatsappLink(product);

  dialogContent.innerHTML = `
    <div class="dialog-layout">
      <div class="dialog-media">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="dialog-copy">
        <p class="eyebrow">${product.category}</p>
        <h2>${product.title}</h2>
        <p>${product.excerpt}</p>
        <div class="price-row">
          <strong class="price">${currency.format(product.price)}</strong>
          <span class="old-price">${currency.format(product.oldPrice)}</span>
        </div>
        <div class="dialog-actions">
          <a
            class="button button-primary"
            href="${product.link}"
            target="_blank"
            rel="nofollow sponsored noopener"
            data-action="offer"
            data-product-key="${product.searchId}"
          >
            <i data-lucide="external-link"></i>
            Ver oferta
          </a>
          <a
            class="button button-secondary"
            href="${whatsappLink}"
            target="_blank"
            rel="noopener"
            data-action="whatsapp"
            data-product-key="${product.searchId}"
          >
            <i data-lucide="message-circle"></i>
            Saiba mais
          </a>
        </div>
      </div>
    </div>
  `;

  dialog.showModal();
  createIcons();
}

async function copyProductId(productId) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(productId);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = productId;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    showToast(`ID copiado: ${productId}`);
  } catch {
    showToast("Não foi possível copiar o ID.");
  }
}

categorySelect.addEventListener("change", (event) => {
  state.category = event.target.value;
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

productGrid.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");

  if (!target) return;

  const product = findProduct(target.dataset.productKey);

  if (!product) return;

  if (target.dataset.action === "copy-id") {
    copyProductId(product.id);
    return;
  }

  if (target.dataset.action === "details") {
    showProductDialog(product);
  }

  if (target.dataset.action === "offer") {
    showToast(`Abrindo oferta: ${product.title}`);
  }
});

productGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;

  const card = event.target.closest(".product-card[data-action='details']");

  if (!card || event.target.closest("a, button")) return;

  const product = findProduct(card.dataset.productKey);

  if (!product) return;

  event.preventDefault();
  showProductDialog(product);
});

dialog.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action='offer'], [data-action='whatsapp']");

  if (target) {
    const product = findProduct(target.dataset.productKey);

    if (!product) return;

    showToast(
      target.dataset.action === "whatsapp"
        ? `Abrindo WhatsApp: ${product.id}`
        : `Abrindo oferta: ${product.title}`,
    );
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

notifyButton.addEventListener("click", enableProductNotifications);
notificationPromptAllow.addEventListener("click", () => enableProductNotifications());
notificationPromptClose.addEventListener("click", hideNotificationPrompt);

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }

  requestNotificationPermissionOnAccess();
  checkForNewProducts();
});

updateView();
updateNotificationButton();
createIcons();

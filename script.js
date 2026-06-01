const products = Array.isArray(window.ESCOLHA_CERTA_PRODUCTS)
  ? window.ESCOLHA_CERTA_PRODUCTS
  : [];

const defaultState = {
  category: "Todos",
  query: "",
  sort: "discount",
};

const state = { ...defaultState };

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const categorySelect = document.querySelector("#categorySelect");
const clearFiltersButton = document.querySelector("#clearFiltersButton");
const resultsCount = document.querySelector("#resultsCount");
const activeFilters = document.querySelector("#activeFilters");
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

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

const PRODUCT_IDS_STORAGE_KEY = "knownProductIds";
const NOTIFICATIONS_ENABLED_KEY = "productNotificationsEnabled";
const NOTIFICATION_PROMPT_DISMISSED_KEY = "notificationPromptDismissed";
const SELLER_WHATSAPP_NUMBER = "5585996402960";

let shouldRestoreHashOnDialogClose = true;

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getDiscountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

function getSavingsAmount(product) {
  return Math.max(product.oldPrice - product.price, 0);
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatProductDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00`)).replace(".", "");
}

function getProductHash(product) {
  return `#produto-${encodeURIComponent(product.searchId)}`;
}

function getProductShareUrl(product) {
  const url = new URL(window.location.href);
  url.hash = getProductHash(product).slice(1);
  return url.toString();
}

function getStoredJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function setStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function renderCategorySelect() {
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];

  categorySelect.innerHTML = categories
    .map(
      (category) => `
        <option value="${escapeHtml(category)}" ${state.category === category ? "selected" : ""}>
          ${escapeHtml(category)}
        </option>
      `,
    )
    .join("");
}

function updateControls() {
  searchInput.value = state.query;
  sortSelect.value = state.sort;
  categorySelect.value = state.category;

  const hasActiveFilters =
    state.query !== defaultState.query ||
    state.category !== defaultState.category ||
    state.sort !== defaultState.sort;

  clearFiltersButton.disabled = !hasActiveFilters;
  clearFiltersButton.setAttribute(
    "aria-label",
    hasActiveFilters ? "Limpar filtros ativos" : "Nenhum filtro ativo para limpar",
  );

  const activeFilterParts = [];
  if (state.query) activeFilterParts.push(`busca: "${state.query}"`);
  if (state.category !== "Todos") activeFilterParts.push(`categoria: ${state.category}`);
  if (state.sort !== defaultState.sort) {
    activeFilterParts.push(`ordem: ${sortSelect.selectedOptions[0]?.textContent || "personalizada"}`);
  }
  activeFilters.textContent = activeFilterParts.join(" | ");
}

function getVisibleProducts() {
  const query = normalize(state.query);

  return products
    .filter((product) => {
      const matchesCategory =
        state.category === "Todos" || product.category === state.category;
      const searchable = normalize(
        [
          product.title,
          product.category,
          product.badge,
          product.id,
          product.searchId,
          product.store,
          product.excerpt,
          ...product.highlights,
          ...product.specs.map((spec) => `${spec.label} ${spec.value}`),
        ].join(" "),
      );
      return matchesCategory && searchable.includes(query);
    })
    .sort((first, second) => {
      if (state.sort === "recent") {
        return new Date(second.date) - new Date(first.date);
      }

      if (state.sort === "name") {
        return first.title.localeCompare(second.title, "pt-BR");
      }

      if (state.sort === "discount") {
        return getDiscountPercent(second) - getDiscountPercent(first);
      }

      return first.price - second.price;
    });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  updateControls();

  resultsCount.textContent = `${visibleProducts.length} ${
    visibleProducts.length === 1 ? "produto encontrado" : "produtos encontrados"
  }`;

  if (!visibleProducts.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        Nenhum produto combina com os filtros atuais. Limpe a busca ou tente outro termo.
      </div>
    `;
    createIcons();
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map((product) => {
      const discountPercent = getDiscountPercent(product);
      const savingsAmount = getSavingsAmount(product);
      const isTopDiscount = topDiscountProductIds.has(product.searchId);

      return `
        <article
          class="product-card"
          id="produto-${escapeHtml(product.searchId)}"
          data-action="details"
          data-product-key="${escapeHtml(product.searchId)}"
          tabindex="0"
          aria-label="Ver detalhes de ${escapeHtml(product.title)}"
        >
          <div class="product-media">
            <button
              class="product-image-button"
              type="button"
              data-action="details"
              data-product-key="${escapeHtml(product.searchId)}"
              aria-label="Ver detalhes de ${escapeHtml(product.title)}"
            >
              <img
                src="${escapeHtml(product.image)}"
                alt="${escapeHtml(product.title)}"
                loading="lazy"
                data-product-image
              />
            </button>
            <span class="product-badge">${discountPercent}% OFF</span>
            ${
              isTopDiscount
                ? `<span class="discount-flame" title="Maior desconto: ${discountPercent}% OFF" aria-label="Produto com maior desconto: ${discountPercent}% OFF">
                    <i data-lucide="flame"></i>
                  </span>`
                : ""
            }
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${escapeHtml(product.category)}</span>
              <span class="product-date">Atualizado ${formatProductDate(product.date)}</span>
            </div>
            <h3>${escapeHtml(product.title)}</h3>
            <div class="product-id-row">
              <code>ID: ${escapeHtml(product.id)}</code>
              <button
                class="icon-button copy-id-button"
                type="button"
                data-action="copy-id"
                data-product-key="${escapeHtml(product.searchId)}"
                aria-label="Copiar ID ${escapeHtml(product.id)}"
              >
                <i data-lucide="copy"></i>
              </button>
            </div>
            <button
              class="product-description"
              type="button"
              data-action="details"
              data-product-key="${escapeHtml(product.searchId)}"
              aria-label="Ver descrição completa de ${escapeHtml(product.title)}"
            >
              ${escapeHtml(product.excerpt)}
            </button>
            <div class="price-row">
              <strong class="price">${currency.format(product.price)}</strong>
              <span class="old-price">${currency.format(product.oldPrice)}</span>
            </div>
            <div class="saving-row">Economize ${currency.format(savingsAmount)}</div>
            <div class="card-actions">
              <a
                class="button button-primary"
                href="${escapeHtml(product.link)}"
                target="_blank"
                rel="nofollow sponsored noopener"
                data-action="offer"
                data-product-key="${escapeHtml(product.searchId)}"
              >
                <i data-lucide="external-link"></i>
                Ver oferta
              </a>
              <button
                class="icon-button share-button"
                type="button"
                data-action="share"
                data-product-key="${escapeHtml(product.searchId)}"
                aria-label="Compartilhar ${escapeHtml(product.title)}"
              >
                <i data-lucide="share-2"></i>
              </button>
              <button
                class="icon-button details-button"
                type="button"
                data-action="details"
                data-product-key="${escapeHtml(product.searchId)}"
                aria-label="Ver detalhes de ${escapeHtml(product.title)}"
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

function getProductFromHash() {
  const prefix = "#produto-";
  if (!window.location.hash.startsWith(prefix)) return null;
  return findProduct(decodeURIComponent(window.location.hash.slice(prefix.length)));
}

function getProductWhatsappLink(product) {
  const message = [
    "Ola! Vim pelo blog Escolha Certa.",
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
  const productIds = getStoredJson(PRODUCT_IDS_STORAGE_KEY, null);
  return Array.isArray(productIds) ? productIds : null;
}

function getProductNotificationOptions(newProducts) {
  const singleProduct = newProducts.length === 1 ? newProducts[0] : null;

  return {
    title: singleProduct ? `Novo produto: ${singleProduct.title}` : "Novos produtos na Escolha Certa",
    body: singleProduct
      ? `${singleProduct.category} por ${currency.format(singleProduct.price)}`
      : `${newProducts.length} novos produtos foram adicionados a vitrine.`,
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

function areNotificationsEnabled() {
  return (
    "Notification" in window &&
    localStorage.getItem(NOTIFICATIONS_ENABLED_KEY) === "true" &&
    Notification.permission === "granted"
  );
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

  const enabled = areNotificationsEnabled();
  notifyButton.setAttribute("aria-pressed", enabled.toString());
  notifyButton.setAttribute(
    "aria-label",
    enabled ? "Desativar alertas de novos produtos" : "Ativar alertas de novos produtos",
  );
  notifyButton.innerHTML = `<i data-lucide="${enabled ? "bell-ring" : "bell"}"></i>`;
  createIcons();
}

function showNotificationPrompt() {
  if (!notificationPrompt || !("Notification" in window)) return;

  const wasDismissed = localStorage.getItem(NOTIFICATION_PROMPT_DISMISSED_KEY) === "true";

  if (Notification.permission !== "default" || wasDismissed) {
    notificationPrompt.hidden = true;
    return;
  }

  notificationPrompt.hidden = false;
  createIcons();
}

function hideNotificationPrompt({ remember = false } = {}) {
  if (remember) {
    localStorage.setItem(NOTIFICATION_PROMPT_DISMISSED_KEY, "true");
  }

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
    hideNotificationPrompt({ remember: true });
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
    if (!quiet) showToast("Alertas de novos produtos não foram ativados.");
    updateNotificationButton();
    showNotificationPrompt();
    return;
  }

  localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "true");
  localStorage.setItem(NOTIFICATION_PROMPT_DISMISSED_KEY, "true");
  localStorage.setItem(
    PRODUCT_IDS_STORAGE_KEY,
    JSON.stringify(products.map((product) => product.searchId)),
  );
  hideNotificationPrompt();
  if (!quiet) showToast("Alertas de novos produtos ativados.");
  updateNotificationButton();
}

function disableProductNotifications() {
  localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "false");
  showToast("Alertas de novos produtos desativados.");
  updateNotificationButton();
}

function toggleProductNotifications() {
  if (areNotificationsEnabled()) {
    disableProductNotifications();
    return;
  }

  enableProductNotifications();
}

function initializeNotifications() {
  if (!("Notification" in window)) {
    updateNotificationButton();
    return;
  }

  if (Notification.permission !== "granted") {
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "false");
  }

  updateNotificationButton();
  window.setTimeout(showNotificationPrompt, 1400);
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

  if (!newProducts.length || !areNotificationsEnabled()) {
    return;
  }

  showProductNotification(newProducts);
  showToast(
    newProducts.length === 1
      ? `Novo produto: ${newProducts[0].title}`
      : `${newProducts.length} novos produtos adicionados.`,
  );
}

function renderDialogContent(product) {
  const whatsappLink = getProductWhatsappLink(product);
  const discountPercent = getDiscountPercent(product);
  const savingsAmount = getSavingsAmount(product);

  dialogContent.innerHTML = `
    <div class="dialog-layout">
      <div class="dialog-media">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" data-product-image />
      </div>
      <div class="dialog-copy">
        <div class="dialog-topline">
          <span class="dialog-chip">${escapeHtml(product.category)}</span>
          <span class="dialog-chip is-strong">${discountPercent}% OFF</span>
          <span class="dialog-chip">Atualizado ${formatProductDate(product.date)}</span>
        </div>
        <h2 id="dialogTitle">${escapeHtml(product.title)}</h2>
        <code class="dialog-id">ID: ${escapeHtml(product.id)}</code>
        <p class="dialog-description">${escapeHtml(product.excerpt)}</p>
        <div class="price-row">
          <strong class="price">${currency.format(product.price)}</strong>
          <span class="old-price">${currency.format(product.oldPrice)}</span>
        </div>
        <div class="saving-row">Economize ${currency.format(savingsAmount)} nesta oferta.</div>
        <div class="dialog-actions">
          <a
            class="button button-primary"
            href="${escapeHtml(product.link)}"
            target="_blank"
            rel="nofollow sponsored noopener"
            data-action="offer"
            data-product-key="${escapeHtml(product.searchId)}"
          >
            <i data-lucide="external-link"></i>
            Ver oferta
          </a>
          <a
            class="button button-secondary"
            href="${escapeHtml(whatsappLink)}"
            target="_blank"
            rel="noopener"
            data-action="whatsapp"
            data-product-key="${escapeHtml(product.searchId)}"
          >
            <i data-lucide="message-circle"></i>
            Saiba mais
          </a>
          <button
            class="button button-secondary"
            type="button"
            data-action="share"
            data-product-key="${escapeHtml(product.searchId)}"
          >
            <i data-lucide="share-2"></i>
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  `;

  createIcons();
}

function showProductDialog(product, { syncHash = true } = {}) {
  dialog.dataset.productKey = product.searchId;
  renderDialogContent(product);

  if (!dialog.open) {
    dialog.showModal();
  }

  if (syncHash && window.location.hash !== getProductHash(product)) {
    history.pushState(null, "", getProductHash(product));
  }
}

function closeProductDialog({ restoreHash = true } = {}) {
  shouldRestoreHashOnDialogClose = restoreHash;

  if (dialog.open) {
    dialog.close();
  }
}

async function copyText(value) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Some browsers expose clipboard but block it outside specific contexts.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  const wasCopied = document.execCommand("copy");
  textarea.remove();

  if (!wasCopied) {
    throw new Error("Copy command failed");
  }
}

async function copyProductId(productId) {
  try {
    await copyText(productId);
    showToast(`ID copiado: ${productId}`);
  } catch {
    showToast("Não foi possível copiar o ID.");
  }
}

async function shareProduct(product) {
  const shareData = {
    title: product.title,
    text: `${product.title} por ${currency.format(product.price)} na Escolha Certa.`,
    url: getProductShareUrl(product),
  };

  try {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Produto compartilhado.");
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    await copyText(shareData.url);
    showToast("Link do produto copiado.");
  } catch {
    history.pushState(null, "", getProductHash(product));
    showToast("Link do produto pronto na barra de endereço.");
  }
}

function resetFilters() {
  Object.assign(state, defaultState);
  renderProducts();
  searchInput.focus();
}

categorySelect.addEventListener("change", (event) => {
  state.category = event.target.value;
  renderProducts();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

clearFiltersButton.addEventListener("click", resetFilters);

productGrid.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");

  if (!target) return;

  const product = findProduct(target.dataset.productKey);

  if (!product) return;

  if (target.dataset.action === "copy-id") {
    event.preventDefault();
    copyProductId(product.id);
    return;
  }

  if (target.dataset.action === "details") {
    showProductDialog(product);
    return;
  }

  if (target.dataset.action === "share") {
    event.preventDefault();
    shareProduct(product);
    return;
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
  if (event.target === dialog) {
    closeProductDialog();
    return;
  }

  const target = event.target.closest("[data-action]");

  if (!target) return;

  const product = findProduct(target.dataset.productKey);

  if (!product) return;

  if (target.dataset.action === "copy-id") {
    event.preventDefault();
    copyProductId(product.id);
    return;
  }

  if (target.dataset.action === "share") {
    event.preventDefault();
    shareProduct(product);
    return;
  }

  showToast(
    target.dataset.action === "whatsapp"
      ? `Abrindo WhatsApp: ${product.id}`
      : `Abrindo oferta: ${product.title}`,
  );
});

dialogClose.addEventListener("click", () => {
  closeProductDialog();
});

dialog.addEventListener("close", () => {
  const product = findProduct(dialog.dataset.productKey);

  if (product && shouldRestoreHashOnDialogClose && window.location.hash === getProductHash(product)) {
    history.pushState(null, "", "#produtos");
  }

  shouldRestoreHashOnDialogClose = true;
  dialog.dataset.productKey = "";
});

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", isOpen.toString());
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuToggle.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
  createIcons();
});

siteNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;

  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  menuToggle.innerHTML = '<i data-lucide="menu"></i>';
  createIcons();
});

notifyButton.addEventListener("click", toggleProductNotifications);
notificationPromptAllow.addEventListener("click", () => enableProductNotifications());
notificationPromptClose.addEventListener("click", () => hideNotificationPrompt({ remember: true }));

window.addEventListener(
  "error",
  (event) => {
    const image = event.target;

    if (!(image instanceof HTMLImageElement) || !image.matches("[data-product-image]")) return;
    if (image.dataset.fallbackApplied) return;

    image.dataset.fallbackApplied = "true";
    image.src = "assets/logo-escolha-certa.png";
    image.alt = "Imagem indisponivel";
  },
  true,
);

window.addEventListener("hashchange", () => {
  const product = getProductFromHash();

  if (product) {
    showProductDialog(product, { syncHash: false });
    return;
  }

  if (dialog.open) {
    closeProductDialog({ restoreHash: false });
  }
});

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }

  initializeNotifications();
  checkForNewProducts();

  const product = getProductFromHash();
  if (product) {
    showProductDialog(product, { syncHash: false });
  }
});

updateView();
updateNotificationButton();
createIcons();

const CACHE_NAME = "escolha-certa-v13";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=20260601-5",
  "./product.js?v=20260601-5",
  "./script.js?v=20260601-5",
  "./manifest.webmanifest",
  "./pages/interface-audio-lives-chamadas.html",
  "./pages/usb-c-xlr-p2.html",
  "./pages/recursos-gravacoes.html",
  "./assets/hero-background.png",
  "./assets/logo-escolha-certa.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-192.png",
  "./assets/icon-maskable-512.png",
  "./src/fifine_sc3/fifinesc3_01.jpg",
  "./src/fifine_sc3/fifinesc3_02.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html")),
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return networkResponse;
      })
      .catch(() => caches.match(event.request)),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "./#produtos",
    self.location.origin,
  ).href;

  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: "window",
      })
      .then((clientList) => {
        const matchingClient = clientList.find((client) => client.url.startsWith(self.location.origin));

        if (matchingClient) {
          if ("navigate" in matchingClient) {
            matchingClient.navigate(targetUrl);
          }

          return matchingClient.focus();
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

        return undefined;
      }),
  );
});

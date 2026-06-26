/* Service worker — cache do app shell para uso offline */
const CACHE = "sao-jose-v7";
const ARQUIVOS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "ensinamentos.js",
  "reflexoes-ano.js",
  "bilhetes.js",
  "icone.svg",
  "icone-192-v2.png",
  "icone-512-v2.png",
  "icone-1024-v2.png",
  "apple-touch-icon-v2.png",
  "manifest-v2.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((resp) => {
      if (resp && resp.ok && resp.type === "basic") {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => { try { c.put(req, copia); } catch (_) {} });
      }
      return resp;
    }).catch(() => hit))
  );
});

/* ---------- Notificação diária (push) ---------- */
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const title = d.title || "À Sombra de São José";
  const options = {
    body: d.body || "Sua reflexão de hoje está pronta.",
    icon: "icone-192.png",
    badge: "icone-192.png",
    lang: "pt-BR",
    tag: "lembrete-diario",
    renotify: true,
    data: { url: d.url || "./" }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

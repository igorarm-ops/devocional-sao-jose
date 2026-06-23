/* Service worker — cache do app shell para uso offline */
const CACHE = "sao-jose-v3";
const ARQUIVOS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "ensinamentos.js",
  "reflexoes-ano.js",
  "bilhetes.js",
  "icone.svg",
  "icone-192.png",
  "icone-512.png",
  "apple-touch-icon.png",
  "manifest.webmanifest"
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

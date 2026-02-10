/* =========================================================
   Serag PWA — sw.js
   Cache-first للأصول + fallback للأوفلاين
   ========================================================= */

const CACHE_VERSION = "serag-v1.0.0";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  // أيقوناتك (عدّل الأسماء إذا مختلفة عندك)
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

// Install: pre-cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first for same-origin, network-first for others
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ignore non-GET
  if (req.method !== "GET") return;

  // Same-origin: cache-first
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Cross-origin: network-first (then cache)
  event.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  try {
    const fresh = await fetch(req);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    // fallback للأوفلاين: رجّع الصفحة الرئيسية
    const fallback = await caches.match("./index.html");
    return fallback || new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await caches.match(req);
    if (cached) return cached;

    const fallback = await caches.match("./index.html");
    return fallback || new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

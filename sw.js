/* =========================================================
   Service Worker — T09
   Cache core assets for offline usage (safe update strategy)
   ========================================================= */

const CACHE_VERSION = "t09-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.webmanifest"
];

// Install: pre-cache core
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k !== CACHE_VERSION ? caches.delete(k) : Promise.resolve())));
    await self.clients.claim();
  })());
});

// Fetch strategy:
// - For navigations: cache-first, fallback to cached index.html
// - For other requests: cache-first, then network, store successful GETs
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  // Navigation requests
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match("./index.html");
      try {
        const fresh = await fetch(req);
        // If network works, update cache for index
        cache.put("./index.html", fresh.clone());
        return fresh;
      } catch {
        return cached || new Response("Offline", { status: 200, headers: { "Content-Type": "text/plain" }});
      }
    })());
    return;
  }

  // Static assets
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req);
    if (cached) return cached;

    try {
      const res = await fetch(req);
      // Cache same-origin assets safely
      const url = new URL(req.url);
      if (url.origin === self.location.origin) {
        cache.put(req, res.clone());
      }
      return res;
    } catch {
      return new Response("", { status: 504 });
    }
  })());
});

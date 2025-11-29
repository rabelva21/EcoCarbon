const CACHE_NAME = 'ecocarbon-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // tambahkan asset lain yang ingin di-cache saat install mis. css, js, icon
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // fallback bisa diarahkan ke offline page jika ada
        return caches.match('/index.html');
      });
    })
  );
});

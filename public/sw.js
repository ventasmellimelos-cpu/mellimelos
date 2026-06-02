// Bumping CACHE_NAME forces old caches to be cleared on activate.
const CACHE_NAME = 'mellimelos-v3';

self.addEventListener('install', (event) => {
  // Activate the new SW immediately instead of waiting for old clients to close.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.url.includes('/api/')) return;
  if (request.url.includes('/uploads/')) return;

  const url = new URL(request.url);
  const isNavigation = request.mode === 'navigate';
  const isHTML = isNavigation || request.destination === 'document' ||
                 (request.headers.get('accept') || '').includes('text/html');

  // Network-first for HTML/navigation: ensures users always get fresh index.html
  // pointing to the current hashed JS/CSS bundles.
  if (isHTML) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request).then((c) => c || caches.match('/')))
    );
    return;
  }

  // Cache-first for hashed static assets (immutable thanks to filename hashing).
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});

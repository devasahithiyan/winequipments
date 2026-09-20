/**
 * Win Equipments - Service Worker (Offline Engineering PWA)
 * Enables offline access to sizing calculators & core engineering sheets
 * in remote plant rooms and basements without cellular connectivity.
 */

const CACHE_NAME = 'win-equipments-v1.1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/design-system.css',
  '/css/components.css',
  '/css/quick-search.css',
  '/js/main.js',
  '/js/calculators.js',
  '/js/quick-search.js',
  '/images/logo.png',
  '/engineering-tools/air-treatment-package-builder.html',
  '/engineering-tools/air-dryer-sizing.html',
  '/engineering-tools/cooling-tower-calculator.html',
  '/engineering-tools/chiller-tonnage-calculator.html',
  '/engineering-tools/compressed-air-energy-calculator.html',
  '/case-studies.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Precache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
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
  if (event.request.method !== 'GET') return;

  // Ignore cross-origin, chrome-extension, and analytics
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update for cache (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for offline navigation
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});

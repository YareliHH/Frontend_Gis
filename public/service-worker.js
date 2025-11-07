/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* global self, caches, clients */

const CACHE_STATIC_NAME = 'gislive-static-v1';
const CACHE_DYNAMIC_NAME = 'gislive-dynamic-v1';
const CACHE_DATA_NAME = 'gislive-data-v1';
const MAX_DYNAMIC_ITEMS = 80;

const API_ORIGIN_DEV = 'http://localhost:3001';
const API_ORIGIN_PROD = 'https://backend-gis-1.onrender.com';

const CRITICAL_API_PATHS = [
  '/api/perfil',        // Información del usuario
  '/api/carrito',       // Carrito de compras
  '/api/productos',     // Lista de productos
];

const ASSETS = [
  '/',
  '/index.html',    
  '/manifest.json',
  '/favicon.ico',
  '/LogoGL.jpg',
  '/offline.html'
];

// Limita el tamaño de la caché dinámica
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

// Evento Install: cacheamos assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Evento Activate: limpieza de caches antiguas
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_STATIC_NAME, CACHE_DYNAMIC_NAME, CACHE_DATA_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => !cacheWhitelist.includes(key))
            .map(key => caches.delete(key))
      )
    )
  );
});

// Evento Fetch: manejo de requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Manejo de endpoints críticos (GET)
  if ((url.origin === API_ORIGIN_DEV || url.origin === API_ORIGIN_PROD) &&
      CRITICAL_API_PATHS.some(path => url.pathname.includes(path))) {

    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(CACHE_DATA_NAME).then(cache => {
            if (networkResponse.ok) cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets y caché dinámica
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
          if (networkResponse.status === 200 && event.request.method === 'GET') {
            cache.put(event.request, networkResponse.clone());
            limitCacheSize(CACHE_DYNAMIC_NAME, MAX_DYNAMIC_ITEMS);
          }
          return networkResponse;
        });
      }).catch(() => {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

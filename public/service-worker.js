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
  '/api/perfil',
  '/api/carrito',
  '/api/productos',
];

// Archivos estáticos
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/LogoGL.jpg',
  '/logo192.png',
  '/logo512.png',

  // Icons
  '/icons/icon-48x48.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

// 🔄 Límite de cache dinámico
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

// 📌 Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 🧹 Activate
self.addEventListener('activate', (event) => {
  const allowedCaches = [CACHE_STATIC_NAME, CACHE_DYNAMIC_NAME, CACHE_DATA_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => !allowedCaches.includes(name))
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// 🌐 Fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 🔹 API crítica
  if (
    (url.origin === API_ORIGIN_DEV || url.origin === API_ORIGIN_PROD) &&
    CRITICAL_API_PATHS.some(path => url.pathname.includes(path))
  ) {
    event.respondWith(
      fetch(event.request)
        .then(res => caches.open(CACHE_DATA_NAME).then(cache => {
          if (res.ok) cache.put(event.request, res.clone());
          return res;
        }))
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 🔹 Caché dinámico de assets
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      if (cacheRes) return cacheRes;

      return fetch(event.request)
        .then(fetchRes =>
          caches.open(CACHE_DYNAMIC_NAME).then(cache => {
            if (fetchRes.status === 200 && event.request.method === 'GET') {
              cache.put(event.request, fetchRes.clone());
              limitCacheSize(CACHE_DYNAMIC_NAME, MAX_DYNAMIC_ITEMS);
            }
            return fetchRes;
          })
        )
        .catch(() => {
          if (event.request.mode === 'navigate') {
            sendOfflineNotification();
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// 🔔 Notificación cuando se pierde conexión
function sendOfflineNotification() {
  if (self.registration && Notification.permission === 'granted') {
    self.registration.showNotification('Sin conexión', {
      body: 'Estás navegando sin internet. Algunos datos pueden no estar actualizados.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png'
    });
  }
}

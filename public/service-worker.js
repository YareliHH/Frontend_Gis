/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* global self, caches, clients */

const CACHE_VERSION = 'v1.0.6';
const CACHE_STATIC_NAME = `gislive-static-${CACHE_VERSION}`;
const CACHE_DYNAMIC_NAME = `gislive-dynamic-${CACHE_VERSION}`;
const CACHE_DATA_NAME = `gislive-data-${CACHE_VERSION}`;
const CACHE_IMAGES_NAME = `gislive-images-${CACHE_VERSION}`;
const MAX_DYNAMIC_ITEMS = 80;
const MAX_IMAGE_ITEMS = 50;

const API_ORIGIN_DEV = 'http://localhost:3001';
const API_ORIGIN_PROD = 'https://backend-gis-1.onrender.com';

// APIs críticas
const CRITICAL_API_PATHS = [
  '/api/perfil',
  '/api/carrito',
  '/api/productos',
  '/api/obtener',
  '/api/acerca_de',
  '/api/getpolitica',
  '/api/faqs',
  '/api/contacto',
  '/api/deslinde/deslinde',
  '/api/termiCondicion/terminos_condiciones',
  '/api/politicas/politicas_privacidad',
  '/api/colaboraciones',
  '/api/ofertas'
];

// ⭐ PÁGINAS IMPORTANTES
const IMPORTANT_PAGES = [
  '/',
  '/acercaDe',
  '/preguntasF',
  '/contacto',
  '/avisosprivacidad',
  '/terminoscondiciones',
  '/deslindelegal',
  '/Ofertasespeciales',
  '/colaboraciones'
];

// Archivos estáticos base
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/LogoGL.jpg',
  '/logo192.png',
  '/logo512.png',
  '/icons/icon-48x48.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-256x256.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// ⭐ TODAS LAS APIs CON RUTAS CORRECTAS
const PRECACHE_API_ENDPOINTS = [
  `${API_ORIGIN_PROD}/api/acerca_de`,
  `${API_ORIGIN_PROD}/api/getpolitica`,
  `${API_ORIGIN_PROD}/api/faqs`,
  `${API_ORIGIN_PROD}/api/deslinde/deslinde`,
  `${API_ORIGIN_PROD}/api/termiCondicion/terminos_condiciones`,
  `${API_ORIGIN_PROD}/api/politicas/politicas_privacidad`,
  `${API_ORIGIN_PROD}/api/productos`,
  `${API_ORIGIN_PROD}/api/obtener`
];

// Verifica si es imagen estática
const isStaticImage = (url) => {
  return url.includes('/static/media/') && 
         (url.includes('.jpg') || url.includes('.jpeg') || 
          url.includes('.png') || url.includes('.webp') || 
          url.includes('.gif') || url.includes('.svg'));
};

// Verifica si es imagen de producto
const isProductImage = (url) => {
  return url.includes('/uploads/') || 
         url.includes('backend-gis') && url.match(/\.(jpg|jpeg|png|webp)$/i);
};

// Limita tamaño del caché
const limitCacheSize = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
};

// ⭐ Pre-cachear datos de APIs
const precacheAPIData = async () => {
  console.log('[SW] 📊 Precacheando datos de APIs...');
  const cache = await caches.open(CACHE_DATA_NAME);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const endpoint of PRECACHE_API_ENDPOINTS) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        await cache.put(endpoint, response.clone());
        const apiName = endpoint.split('/api/')[1];
        console.log(`[SW] ✅ API cacheada: ${apiName}`);
        successCount++;
      } else {
        const apiName = endpoint.split('/api/')[1];
        console.log(`[SW] ⚠️ API respondió con error ${response.status}: ${apiName}`);
        failCount++;
      }
    } catch (error) {
      const apiName = endpoint.split('/api/')[1];
      console.log(`[SW] ⚠️ No se pudo cachear: ${apiName}`, error.message);
      failCount++;
    }
  }
  
  console.log(`[SW] 📊 Precaching APIs completado: ${successCount} exitosas, ${failCount} fallidas`);
};

// ⭐ Pre-cachear páginas importantes
const precacheImportantPages = async () => {
  console.log('[SW] 📄 Precacheando páginas importantes...');
  const cache = await caches.open(CACHE_DYNAMIC_NAME);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const page of IMPORTANT_PAGES) {
    try {
      const response = await fetch(page);
      if (response.ok) {
        await cache.put(page, response.clone());
        console.log(`[SW] ✅ Página cacheada: ${page}`);
        successCount++;
      } else {
        console.log(`[SW] ⚠️ Página respondió con error ${response.status}: ${page}`);
        failCount++;
      }
    } catch (error) {
      console.log(`[SW] ⚠️ No se pudo cachear: ${page}`);
      failCount++;
    }
  }
  
  console.log(`[SW] 📄 Precaching páginas completado: ${successCount} exitosas, ${failCount} fallidas`);
};

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] 🔧 Instalando Service Worker v1.0.6...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_STATIC_NAME).then((cache) => {
        console.log('[SW] 📦 Precacheando assets estáticos');
        return cache.addAll(STATIC_ASSETS);
      }),
      precacheImportantPages(),
      precacheAPIData()
    ])
    .then(() => {
      console.log('[SW] ✅ Precaching completo - Páginas y datos listos offline');
    })
    .catch((error) => {
      console.error('[SW] ❌ Error en precaching:', error);
    })
  );
  
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] 🚀 Activando Service Worker v1.0.6...');
  const allowedCaches = [
    CACHE_STATIC_NAME, 
    CACHE_DYNAMIC_NAME, 
    CACHE_DATA_NAME,
    CACHE_IMAGES_NAME
  ];
  
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => !allowedCaches.includes(name))
          .map(name => {
            console.log('[SW] 🧹 Eliminando caché antigua:', name);
            return caches.delete(name);
          })
      )
    )
  );
  
  return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. IMÁGENES ESTÁTICAS
  if (isStaticImage(request.url)) {
    event.respondWith(
      caches.open(CACHE_IMAGES_NAME).then(cache => {
        return cache.match(request).then(cacheRes => {
          if (cacheRes) {
            return cacheRes;
          }

          return fetch(request).then(fetchRes => {
            if (fetchRes && fetchRes.status === 200) {
              const fetchResClone = fetchRes.clone();
              cache.put(request, fetchResClone);
              limitCacheSize(CACHE_IMAGES_NAME, MAX_IMAGE_ITEMS);
            }
            return fetchRes;
          }).catch(() => {
            return new Response(
              '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#e0f7fa"/><text x="50%" y="50%" text-anchor="middle" fill="#00695c" font-size="16">Imagen no disponible offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        });
      })
    );
    return;
  }

  // 2. IMÁGENES DE PRODUCTOS
  if (isProductImage(request.url)) {
    event.respondWith(
      caches.match(request).then(cacheRes => {
        if (cacheRes) {
          return cacheRes;
        }

        return fetch(request).then(fetchRes => {
          if (fetchRes && fetchRes.status === 200) {
            return caches.open(CACHE_IMAGES_NAME).then(cache => {
              cache.put(request, fetchRes.clone());
              limitCacheSize(CACHE_IMAGES_NAME, MAX_IMAGE_ITEMS);
              return fetchRes;
            });
          }
          return fetchRes;
        }).catch(() => {
          return new Response(
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#e0f7fa"/><text x="50%" y="45%" text-anchor="middle" fill="#00695c" font-size="18" font-weight="bold">GisLive</text><text x="50%" y="55%" text-anchor="middle" fill="#00695c" font-size="14">Producto sin conexión</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        });
      })
    );
    return;
  }

  // 3. APIs CRÍTICAS - Cache First
  if (
    (url.origin === API_ORIGIN_DEV || url.origin === API_ORIGIN_PROD) &&
    CRITICAL_API_PATHS.some(path => url.pathname.includes(path))
  ) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_DATA_NAME).then(cache => {
                cache.put(request, responseClone);
                console.log('[SW] 🔄 API actualizada:', url.pathname);
              });
            }
            return response;
          })
          .catch(() => null);
        
        return cachedResponse || fetchPromise.then(response => {
          if (!response) {
            return new Response(
              JSON.stringify({ 
                offline: true, 
                message: 'No hay conexión y no hay datos en caché.' 
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            );
          }
          return response;
        });
      })
    );
    return;
  }

  // 4. PÁGINAS IMPORTANTES - Cache First
  if (IMPORTANT_PAGES.some(page => url.pathname === page || url.pathname.startsWith(page))) {
    event.respondWith(
      caches.match(request).then(cacheRes => {
        if (cacheRes) {
          fetch(request).then(fetchRes => {
            if (fetchRes && fetchRes.status === 200) {
              caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                cache.put(request, fetchRes.clone());
              });
            }
          }).catch(() => {});
          
          return cacheRes;
        }

        return fetch(request).then(fetchRes => {
          if (fetchRes && fetchRes.status === 200) {
            return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
              cache.put(request, fetchRes.clone());
              return fetchRes;
            });
          }
          return fetchRes;
        }).catch(() => {
          return caches.match('/offline.html');
        });
      })
    );
    return;
  }

  // 5. RESTO - Cache First
  event.respondWith(
    caches.match(request).then(cacheRes => {
      if (cacheRes) {
        return cacheRes;
      }

      return fetch(request)
        .then(fetchRes => {
          if (!fetchRes || fetchRes.status !== 200 || request.method !== 'GET') {
            return fetchRes;
          }

          const fetchResClone = fetchRes.clone();
          
          caches.open(CACHE_DYNAMIC_NAME).then(cache => {
            cache.put(request, fetchResClone);
            limitCacheSize(CACHE_DYNAMIC_NAME, MAX_DYNAMIC_ITEMS);
          });

          return fetchRes;
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return null;
        });
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(precacheAPIData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de GisLive',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification('GisLive Boutique', options)
  );
});

// Mensajes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'PRECACHE_NOW') {
    event.waitUntil(
      Promise.all([
        precacheImportantPages(),
        precacheAPIData()
      ])
    );
  }
});
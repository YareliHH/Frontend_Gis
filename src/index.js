import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import App from './App';
import reportWebVitals from './reportWebVitals';

// Crear raíz de React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Función para mostrar notificación de actualización
const showUpdateNotification = (registration) => {
  const updateBanner = document.createElement('div');
  updateBanner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #3B8D99;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: 'Montserrat', Arial, sans-serif;
    max-width: 350px;
  `;
  
  updateBanner.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="flex: 1;">
        <strong style="display: block; margin-bottom: 4px;">Nueva versión disponible</strong>
        <span style="font-size: 14px;">Actualiza para obtener las últimas mejoras</span>
      </div>
      <button id="update-btn" style="
        background: white;
        color: #3B8D99;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
      ">
        Actualizar
      </button>
    </div>
  `;
  
  document.body.appendChild(updateBanner);
  
  document.getElementById('update-btn').addEventListener('click', () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  });
  
  setTimeout(() => {
    updateBanner.remove();
  }, 10000);
};

// ⭐ FUNCIÓN PARA FORZAR PRECACHING DE PÁGINAS
const forcePrecachePages = async () => {
  if ('serviceWorker' in navigator && navigator.onLine) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      if (registration.active) {
        // Enviar mensaje al SW para forzar precaching
        registration.active.postMessage({ type: 'PRECACHE_NOW' });
        console.log('✅ Precaching automático iniciado');
        
        // Verificar después de 5 segundos
        setTimeout(async () => {
          try {
            const cacheNames = await caches.keys();
            const dataCache = cacheNames.find(name => name.includes('data'));
            
            if (dataCache) {
              const cache = await caches.open(dataCache);
              const keys = await cache.keys();
              console.log('📊 Datos precacheados:', keys.length);
              
              // Verificar datos específicos
              const acercaDe = await cache.match(`${window.location.origin.replace('3000', '3001')}/api/acerca_de`);
              if (acercaDe) {
                console.log('✅ Acerca De cacheado automáticamente');
              }
            }
          } catch (err) {
            console.log('⚠️ No se pudo verificar precaching:', err);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error al forzar precaching:', error);
    }
  }
};

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);
        
        // ⭐ FORZAR PRECACHING DESPUÉS DE REGISTRAR
        setTimeout(forcePrecachePages, 2000);
        
        // Detectar actualizaciones del Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nueva versión del Service Worker disponible');
              showUpdateNotification(registration);
            }
          });
        });
        
        // Verificar actualizaciones cada 60 minutos
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      });

    // Escuchar mensajes del Service Worker
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker actualizado, recargando...');
      window.location.reload();
    });
  });

  // ⭐ Forzar precaching cuando vuelve la conexión
  window.addEventListener('online', () => {
    console.log('✅ Conexión restaurada - Iniciando precaching');
    forcePrecachePages();
    
    if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register('sync-data');
      }).catch((error) => {
        console.error('Error al registrar sincronización:', error);
      });
    }
  });

  // Detectar cuando se pierde la conexión
  window.addEventListener('offline', () => {
    console.log('⚠️ Sin conexión - Modo offline activado');
  });
}

// Solicitar permiso para notificaciones
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✅ Permiso de notificaciones concedido');
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  }
};

// Solicitar permisos después de 5 segundos (no intrusivo)
setTimeout(requestNotificationPermission, 5000);

// Reportar métricas de rendimiento
reportWebVitals(console.log);
// Hook para detectar estado de conexión
import { useState, useEffect } from 'react';

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Actualizar estado cuando cambia la conexión
    const handleOnline = () => {
      setIsOnline(true);
      console.log('✅ Conexión restaurada');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('❌ Sin conexión');
    };

    // Agregar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;
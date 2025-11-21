// Guarda datos en localStorage con timestamp
export const saveToCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch (e) {
    console.error('Error guardando cache:', e);
  }
};

// Obtiene datos del cache
export const getFromCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.error('Error leyendo cache:', e);
    return null;
  }
};

// Verifica si el cache es válido (menos de 24 horas)
export const isCacheValid = (key, maxAge = 24 * 60 * 60 * 1000) => {
  try {
    const timestamp = localStorage.getItem(`${key}_timestamp`);
    if (!timestamp) return false;
    return (Date.now() - parseInt(timestamp)) < maxAge;
  } catch (e) {
    return false;
  }
};

// Fetch con fallback a cache
export const fetchWithCache = async (url, cacheKey) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    saveToCache(cacheKey, data);
    return { data, fromCache: false };
  } catch (error) {
    const cached = getFromCache(cacheKey);
    if (cached) {
      return { data: cached, fromCache: true };
    }
    throw error;
  }
};
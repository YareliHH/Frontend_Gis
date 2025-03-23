import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs'; // Asegúrate de importar correctamente

// Componente que detecta dinámicamente de dónde viene el usuario
const DynamicBreadcrumbsDetector = ({ children }) => {
  const location = useLocation();
  const params = useParams();
  const [breadcrumbPaths, setBreadcrumbPaths] = useState([]);
  
  useEffect(() => {
    // Función para determinar de dónde vino el usuario
    const detectOrigin = () => {
      // 1. Verificar si hay state en la navegación
      if (location.state && location.state.from) {
        switch (location.state.from) {
          case 'hombres':
            return [
              { name: 'Home', path: '/cliente' },
              { name: 'Hombre', path: '/cliente/hombres' },
              { name: location.state.productName || 'Detalle Producto' }
            ];
          case 'mujeres':
            return [
              { name: 'Home', path: '/cliente' },
              { name: 'Mujer', path: '/cliente/mujeres' },
              { name: location.state.productName || 'Detalle Producto' }
            ];
          case 'ofertas':
            return [
              { name: 'Home', path: '/cliente' },
              { name: 'Ofertas Cliente', path: '/ofertasCliente' },
              { name: location.state.productName || 'Detalle Producto' }
            ];
          default:
            break;
        }
      }
      
      // 2. Verificar el referrer si está disponible
      const referrer = document.referrer;
      if (referrer) {
        if (referrer.includes('/hombres')) {
          return [
            { name: 'Home', path: '/cliente' },
            { name: 'Hombre', path: '/hombres' },
            { name: 'Detalle Producto' }
          ];
        } else if (referrer.includes('/mujeres')) {
          return [
            { name: 'Home', path: '/cliente' },
            { name: 'Mujer', path: '/mujeres' },
            { name: 'Detalle Producto' }
          ];
        } else if (referrer.includes('/ofertasCliente')) {
          return [
            { name: 'Home', path: '/cliente' },
            { name: 'Ofertas Cliente', path: '/ofertasCliente' },
            { name: 'Detalle Producto' }
          ];
        }
      }
      
      // 3. Intentar obtener la última página visitada de sessionStorage
      const lastVisited = sessionStorage.getItem('lastVisitedSection');
      if (lastVisited) {
        switch (lastVisited) {
          case 'hombres':
            return [
              { name: 'Home', path: '/cliente' },
              { name: 'Hombre', path: '/hombres' },
              { name: 'Detalle Producto' }
            ];
          case 'mujeres':
            return [
              { name: 'Home', path: '/cliente' },
              { name: 'Mujer', path: '/mujeres' },
              { name: 'Detalle Producto' }
            ];
          case 'ofertas':
            return [
              { name: 'Home', path: '/cliente' },
              { name: 'Ofertas Cliente', path: '/ofertasCliente' },
              { name: 'Detalle Producto' }
            ];
          default:
            break;
        }
      }
      
      // 4. Opción predeterminada si no se puede determinar
      return [
        { name: 'Home', path: '/cliente' },
        { name: 'Catálogo', path: '/hombres' },
        { name: 'Detalle Producto' }
      ];
    };
    
    // Establecer las rutas de breadcrumb
    setBreadcrumbPaths(detectOrigin());
  }, [location]);
  
  // Renderizar los breadcrumbs y los children
  return (
    <>
      <Breadcrumbs paths={breadcrumbPaths} />
      {children}
    </>
  );
};

export default DynamicBreadcrumbsDetector;
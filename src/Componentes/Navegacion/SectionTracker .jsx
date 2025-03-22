import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Este componente se puede agregar en tus componentes de secciones principales
// para guardar automáticamente la última sección visitada
const SectionTracker = ({ sectionName }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Guardar la sección actual en sessionStorage
    sessionStorage.setItem('lastVisitedSection', sectionName);
  }, [sectionName, location]);
  
  // Este componente no renderiza nada
  return null;
};

export default SectionTracker;
import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import EncabezadoAdministrativo from '../Administrativo/encabezadoAdministrativo';
import PieDePagina from '../Administrativo/Footeradmin';

/**
 * Layout principal para la sección administrativa
 * Implementa un diseño con panel lateral, área de contenido y pie de página
 * Se adapta a todos los tamaños de pantalla
 */
const LayoutConEncabezadoAdmin = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Encabezado con navegación lateral */}
      <EncabezadoAdministrativo />
      
      {/* Contenido principal */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: 3, 
          marginLeft: { xs: 0, md: '280px' }, // Corresponde al ancho del drawer
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          transition: 'margin 225ms cubic-bezier(0.0, 0.0, 0.2, 1) 0ms'
        }}
      >
        <div className="main-content">
          {children}
        </div>
      </Box>
      
      {/* Pie de página */}
      <Box 
        component="footer"
        sx={{ 
          marginLeft: { xs: 0, md: '280px' }, 
          width: { xs: '100%', md: 'calc(100% - 280px)' }
        }}
      >
        <PieDePagina />
      </Box>
    </Box>
  );
};

export default LayoutConEncabezadoAdmin;
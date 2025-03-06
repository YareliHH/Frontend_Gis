// LayoutConEncabezado.js
import React from 'react';
import Encabezado from '../Administrativo/encabezadoAdministrativo.jsx';
import PieDePagina from '../Administrativo/Footeradmin.jsx';

const LayoutConEncabezadoAdmin = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <Encabezado />
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer>
        <PieDePagina />
      </footer>
    </div>
  );
}

export default LayoutConEncabezadoAdmin;

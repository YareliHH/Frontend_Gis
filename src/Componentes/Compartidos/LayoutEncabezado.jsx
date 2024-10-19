// LayoutConEncabezado.js
import React from 'react';
import BarraNav from './barraNav.jsx';
import PieDePagina from './Footer.jsx';

const LayoutConEncabezado = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <BarraNav />
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

export default LayoutConEncabezado;

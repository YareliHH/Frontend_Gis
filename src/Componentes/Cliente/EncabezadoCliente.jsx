// LayoutConEncabezado.js
import React from 'react';
import BarraNavCliente from './barraNavCliente.jsx';
import PieDePaginaCliente from './FooterCliente.jsx';

const EncabezadoCliente = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <BarraNavCliente />
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer>
        <PieDePaginaCliente />
      </footer>
    </div>
  );
}

export default EncabezadoCliente;
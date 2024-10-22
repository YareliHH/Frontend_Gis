import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//compartidos
import LayoutEncabezado from './Componentes/Compartidos/LayoutEncabezado';
import PaginaPrincipal from './Componentes/Inicio/PaginaPrincipal';
import PaginaAdministrativa from './Componentes/Inicio/PaginaAdministrativa';
import PaginaCliente from './Componentes/Inicio/PaginaCliente';
import RecuperarContrasena from './Componentes/Inicio/recuperarContrasena'; 
import Sobrenosotros from './Componentes/Inicio/sobrenosotros'; 
import VerificarCorreo from './Componentes/Inicio/verificarCorreo'; 

//inicio
import Registro from './Componentes/Inicio/registo.jsx';
import Login from './Componentes/Inicio/login.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutEncabezado><PaginaPrincipal /></LayoutEncabezado>} />
        <Route path="admin" element={<LayoutEncabezado><PaginaAdministrativa/></LayoutEncabezado>} />
        <Route path="/cliente" element={<LayoutEncabezado><PaginaCliente /></LayoutEncabezado>} />
        <Route path="/login" element={<LayoutEncabezado><Login /></LayoutEncabezado>} />
        <Route path="/registro" element={<LayoutEncabezado><Registro /></LayoutEncabezado>} />
        <Route path="/recuperar_password" element={<RecuperarContrasena />} /> 
        <Route path="/admin/informacion/lista-quienes-somos" element={<Sobrenosotros />} /> 
        <Route path="/verificar-correo" element={<VerificarCorreo />} /> 
        
      </Routes>
    </Router>
  );
};

export default App;

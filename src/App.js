import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Estilos globales para react-slick (carrusel)
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

//PAGINA DE INICIO 
import LayoutEncabezado from './Componentes/Compartidos/LayoutEncabezado';
import { ThemeProvider } from './Componentes/Temas/themeContext';

import PaginaPrincipal from './Componentes/Inicio/PaginaPrincipal';
import VerificarCorreo from './Componentes/Inicio/verificarCorreo'; 
import RecuperarContraseña from './Componentes/Inicio/recuperarPassword';
import CambiarContra from './Componentes/Inicio/CambiarPassword.jsx';
import Registro from './Componentes/Inicio/registo.jsx';
import Login from './Componentes/Inicio/login.jsx';
import Contactanos from './Componentes/Inicio/Contactanos.jsx';
import FAQ from'./Componentes/Inicio/FAQ.jsx';
import Busqueda from './Componentes/Inicio/Busqueda.jsx';
import Chat from './Componentes/Inicio/chat.jsx';
import OfertasEspeciales from './Componentes/Inicio/OfertasEspeciales.jsx';

import DetallesPrin from './Componentes/Inicio/DetallesPrin.jsx';

import Breadcrumbs from './Componentes/Navegacion/Breadcrumbs.jsx';


//CLIENTE 
import PaginaCliente from './Componentes/Cliente/PaginaCliente.jsx';
import Hombre from './Componentes/Cliente/Hombre.jsx';
import Mujer from './Componentes/Cliente/Mujer.jsx';
import EncabezadoCliente from './Componentes/Cliente/EncabezadoCliente';
import Perfil from './Componentes/Cliente/Perfil.jsx';
import OfertasCliente from './Componentes/Cliente/OfertasCliente.jsx';
import DetallesProducto from './Componentes/Cliente/DetallesProducto.jsx';
import DetallesOfertas from './Componentes/Cliente/DetallesOfertas.jsx';
import DetallesProMujer from './Componentes/Cliente/DetallesProMujer.jsx';



// Componentes administrativos
import PaginaAdministrativa from './Componentes/Administrativo/PaginaAdministrativa.jsx';
import LayoutEncabezadoAdmin from './Componentes/Administrativo/LayoutConEncabezadoAdmin.jsx';
import Deslinde from './Componentes/Administrativo/Deslinde'; 
import PerfilEmpresa from './Componentes/Administrativo/PerfilEmpresa'; 
import Politicas from './Componentes/Administrativo/Politicas'; 
import TerminosCondiciones from './Componentes/Administrativo/Terminos'; 
import RedesSociales from './Componentes/Administrativo/RedesSociales'; 
import Reportes from './Componentes/Administrativo/Reporte.jsx'; 
import Contactanosadmin from './Componentes/Administrativo/Contactanosadmi.jsx'; 
import AcercaDe from './Componentes/Inicio/AcercaDe.jsx';
import ProductosAdmin from './Componentes/Administrativo/Productos.jsx';
import Categorias from './Componentes/Administrativo/Categorias.jsx';

//ERRORES
import Error500 from './Componentes/Pagina/Error500.jsx';
import Error404 from './Componentes/Pagina/Error404.jsx';
import Error400 from './Componentes/Pagina/Error400.jsx';




const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* PAGINA PRINCIPAL */}
          <Route path="/" element={<LayoutEncabezado><PaginaPrincipal /></LayoutEncabezado>} />

          <Route path="/login" element={<LayoutEncabezado><Login /></LayoutEncabezado>} />
          <Route path="/registro" element={<LayoutEncabezado><Registro /></LayoutEncabezado>} />
          <Route path="/verificar-correo" element={<VerificarCorreo />} /> 
          <Route path="/recuperar_password" element={<RecuperarContraseña />} />
          <Route path="/resetear_contrasena" element={<CambiarContra />} />
          <Route path="/Ofertasespeciales" element={<LayoutEncabezado><OfertasEspeciales /></LayoutEncabezado>} />
          <Route path="/contacto" element={<LayoutEncabezado><Contactanos /></LayoutEncabezado>} />
          <Route path="/acercaDe" element={<LayoutEncabezado><Breadcrumbs paths={[{ name: 'Inicio', path: '/' }, { name: 'Acerca de' }]} /><AcercaDe /></LayoutEncabezado>} />
          <Route path="/busqueda" element={<LayoutEncabezado><Busqueda /></LayoutEncabezado>} />
          <Route path="/preguntasF" element={<LayoutEncabezado><FAQ/></LayoutEncabezado>} />
          <Route path="/detalles" element={<DetallesPrin/>} />

          

           {/* Rutas de CLIENTE */}
           <Route path="/cliente" element={<EncabezadoCliente><PaginaCliente /></EncabezadoCliente>} />
          <Route path="/hombre" element={<EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Hombre',}]} /><Hombre /></EncabezadoCliente>} />
          <Route path="/mujer" element={<EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Mujer',}]} /><Mujer /></EncabezadoCliente>} />
          <Route path="/perfil" element={<EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Perfil',}]} /><Perfil /></EncabezadoCliente>} />
          <Route path="/ofertasCliente" element={<EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Ofertas Cliente',}]} /><OfertasCliente /></EncabezadoCliente>} />
          <Route path="/detalles-producto" element={<EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Hombre', path: '/hombre',},{ name: 'Detalle Hombre',}]} /><DetallesProducto /></EncabezadoCliente>} />
          <Route path="/detalles-ofertas" element={<EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Ofertas Cliente', path: '/ofertasCliente',},{ name: 'Detalle Ofertas',}]} /><DetallesOfertas /></EncabezadoCliente>} />
          <Route path="/detalles-Mujer" element={<EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Mujer', path: '/mujer',},{ name: 'Detalle Mujer',}]} /><DetallesProMujer /></EncabezadoCliente>} />


         
          <Route path="/*" element={<Error404 />} />
          <Route path="/error500" element={<Error500 />} />
          <Route path="/error400" element={<Error400/>} />

          {/* Rutas administrativas */}
          <Route path="/admin" element={<LayoutEncabezadoAdmin><PaginaAdministrativa/></LayoutEncabezadoAdmin>} />
          <Route path="/admin/deslinde" element={<LayoutEncabezadoAdmin><Deslinde/></LayoutEncabezadoAdmin>} /> 
          <Route path="/admin/perfil" element={<LayoutEncabezadoAdmin><PerfilEmpresa/></LayoutEncabezadoAdmin>} /> 
          <Route path="/admin/politicas" element={<LayoutEncabezadoAdmin><Politicas/></LayoutEncabezadoAdmin>} /> 
          <Route path="/admin/terminos" element={<LayoutEncabezadoAdmin><TerminosCondiciones/></LayoutEncabezadoAdmin>} /> 
          <Route path="/admin/redesSociales" element={<LayoutEncabezadoAdmin><RedesSociales/></LayoutEncabezadoAdmin>} /> 
          <Route path="/admin/reportes" element={<LayoutEncabezadoAdmin><Reportes/></LayoutEncabezadoAdmin>} /> 
          <Route path="/admin/contactanosadmin" element={<LayoutEncabezadoAdmin><Contactanosadmin/></LayoutEncabezadoAdmin>} /> 
          <Route path="/admin/Productosadmin" element={<LayoutEncabezadoAdmin><ProductosAdmin/></LayoutEncabezadoAdmin>} />
          <Route path="/admin/categorias" element={<LayoutEncabezadoAdmin><Categorias/></LayoutEncabezadoAdmin>} />
        
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
//no se que hacer
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importar el componente de protección de rutas
import { AuthProvider } from './Componentes/Autenticacion/AuthContext.jsx';
import ProtectedRoute from './Componentes/Autenticacion/protectedRoute.jsx';

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
import FAQ from './Componentes/Inicio/FAQ.jsx';
import Busqueda from './Componentes/Inicio/Busqueda.jsx';
import Chat from './Componentes/Inicio/chat.jsx';
import OfertasEspeciales from './Componentes/Inicio/OfertasEspeciales.jsx';
import DetallesPrin from './Componentes/Inicio/DetallesPrin.jsx';
import Breadcrumbs from './Componentes/Navegacion/Breadcrumbs.jsx';
import DynamicBreadcrumbsDetector from './Componentes/Navegacion/DynamicBreadcrumbs.jsx';
import SectionTracker from './Componentes/Navegacion/SectionTracker .jsx';
import Colaboraciones from './Componentes/Inicio/colaboraciones.jsx';
import DeslindeLegal from './Componentes/Inicio/deslinde.jsx'
import TerminosYCondiciones from './Componentes/Inicio/condicione.jsx'
import AvisosdePrivacidad from './Componentes/Inicio/privacidad.jsx'

//CLIENTE 
import PaginaCliente from './Componentes/Cliente/PaginaCliente.jsx';
import Hombre from './Componentes/Cliente/Hombre.jsx';
import Mujer from './Componentes/Cliente/Mujer.jsx';
import EncabezadoCliente from './Componentes/Cliente/EncabezadoCliente';
import Perfil from './Componentes/Cliente/Perfil.jsx';
import OfertasCliente from './Componentes/Cliente/OfertasCliente.jsx';
import DetallesProducto from './Componentes/Cliente/DetallesProducto.jsx';
import CarritoC from './Componentes/Cliente/carrito.jsx';
import DetallesProMujer from './Componentes/Cliente/DetallesProMujer.jsx';
import PoliticaC from './Componentes/Cliente/AvisosCliente.jsx';
import CondicionesC from './Componentes/Cliente/condicionesCliente.jsx';
import DeslindeC from './Componentes/Cliente/deslindeCliente.jsx';
import PreguntasFrecuentesC from './Componentes/Cliente/FAQCliente.jsx';
import ContactanosCliente from './Componentes/Cliente/ContactanosCliente.jsx';
import MetodoPago from './Componentes/Cliente/Mercadopago.jsx';

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
import Colores from './Componentes/Administrativo/Colores.jsx';
import Tallas from './Componentes/Administrativo/Tallas.jsx';
import Generos from './Componentes/Administrativo/Generos.jsx';
import FaqsAdmin from './Componentes/Administrativo/Faqsadmin.jsx';
import Ventas from './Componentes/Administrativo/Ventas.jsx';
import Banner from './Componentes/Administrativo/Banner.jsx';
import PromocionAdmin from './Componentes/Administrativo/PromocionAdmin.jsx';

// Componentes del Empleado
import PaginaEmpleado from './Componentes/Empleado/PaginaEmpleado.jsx';
import LayoutEncabezadoEmpleado from './Componentes/Empleado/LayoutEncabezadoEmpleado.jsx';

//ERRORES
import Error500 from './Componentes/Pagina/Error500.jsx';
import Error404 from './Componentes/Pagina/Error404.jsx';
import Error400 from './Componentes/Pagina/Error400.jsx';
import AuthError from './Componentes/Autenticacion/AuthError.jsx';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* PAGINA PRINCIPAL */}
            <Route path="/" element={<LayoutEncabezado><PaginaPrincipal /></LayoutEncabezado>} />
            <Route path="/login" element={<LayoutEncabezado><Login /></LayoutEncabezado>} />
            <Route path="/registro" element={<LayoutEncabezado><Registro /></LayoutEncabezado>} />
            <Route path="/verificar-correo" element={<LayoutEncabezado><VerificarCorreo /></LayoutEncabezado>} />
            <Route path="/recuperar_password" element={<LayoutEncabezado><RecuperarContraseña /></LayoutEncabezado>} />
            <Route path="/resetear_contrasena" element={<LayoutEncabezado><CambiarContra /></LayoutEncabezado>} />
            <Route path="/Ofertasespeciales" element={<LayoutEncabezado><OfertasEspeciales /></LayoutEncabezado>} />
            <Route path="/contacto" element={<LayoutEncabezado><Breadcrumbs paths={[{ name: 'Inicio', path: '/' }, { name: 'Contactanos' }]} /><Contactanos /></LayoutEncabezado>} />
            <Route path="/acercaDe" element={<LayoutEncabezado><Breadcrumbs paths={[{ name: 'Inicio', path: '/' }, { name: 'Acerca de' }]} /><AcercaDe /></LayoutEncabezado>} />
            <Route path="/busqueda" element={<LayoutEncabezado><Busqueda /></LayoutEncabezado>} />
            <Route path="/preguntasF" element={<LayoutEncabezado><Breadcrumbs paths={[{ name: 'Inicio', path: '/' }, { name: 'FAQ' }]} /><FAQ /></LayoutEncabezado>} />
            <Route path="/chat" element={<LayoutEncabezado><Chat /></LayoutEncabezado>} />
            <Route path="/colaboraciones" element={<LayoutEncabezado><Breadcrumbs paths={[{ name: 'Inicio', path: '/' }, { name: 'colaboraciones' }]} /><Colaboraciones /></LayoutEncabezado>} />
            <Route path="/deslindelegal" element={<LayoutEncabezado><Breadcrumbs paths={[{ name: 'Inicio', path: '/' }, { name: 'Deslinde legal' }]} /><DeslindeLegal /></LayoutEncabezado>} />
            <Route path="/terminoscondiciones" element={<LayoutEncabezado><Breadcrumbs paths={[{ name: 'Inicio', path: '/' }, { name: 'Terminos y condiciones' }]} /><TerminosYCondiciones /></LayoutEncabezado>} />
            <Route path="/avisosprivacidad" element={<LayoutEncabezado><Breadcrumbs paths={[{ name: 'Inicio', path: '/' }, { name: 'Avisos de privacidad' }]} /> <AvisosdePrivacidad /> </LayoutEncabezado>} />
            <Route path="/detalles" element={<DetallesPrin />} />

            {/* Páginas de error */}
            <Route path="/error-auth" element={<LayoutEncabezado><AuthError /></LayoutEncabezado>} />
            <Route path="/error500" element={<LayoutEncabezado><Error500 /></LayoutEncabezado>} />
            <Route path="/error400" element={<LayoutEncabezado><Error400 /></LayoutEncabezado>} />

            {/* Rutas de CLIENTE - Protegidas */}
            <Route path="/cliente" element={<ProtectedRoute requiredRole="usuario">  <EncabezadoCliente><PaginaCliente /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/hombres" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><SectionTracker sectionName="hombres" /><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Hombre' }]} /><Hombre /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/mujeres" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><SectionTracker sectionName="mujeres" /><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Mujer' }]} /> <Mujer /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/detallesp/:id" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><DynamicBreadcrumbsDetector><DetallesProducto /></DynamicBreadcrumbsDetector></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/perfil" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Perfil' }]} /><Perfil /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/ofertasCliente" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Ofertas Cliente' }]} /><OfertasCliente /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/detalles-producto" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Hombre', path: '/cliente/hombres' }, { name: 'Detalle Hombre' }]} /><DetallesProducto /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/carrito-compras" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Carrito', path: '/cliente/carrito' }, { name: 'carrito compras' }]} /><CarritoC /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/detalles-Mujer" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Mujer', path: '/cliente/mujeres' }, { name: 'Detalle Mujer' }]} /><DetallesProMujer /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/avisosCliente" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'PoliticasC' }]} /><PoliticaC /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/condicionesCliente" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'CondicionesC' }]} /><CondicionesC /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/deslindeCliente" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'deslindeC' }]} /><DeslindeC /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/preguntasFCliente" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Faqs' }]} /><PreguntasFrecuentesC /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/contactoCliente" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'Contactanos' }]} /><ContactanosCliente /></EncabezadoCliente></ProtectedRoute>} />
            <Route path="/cliente/mercadopago" element={<ProtectedRoute requiredRole="usuario"><EncabezadoCliente><Breadcrumbs paths={[{ name: 'Home', path: '/cliente' }, { name: 'MetodoPago' }]} /><MetodoPago/></EncabezadoCliente></ProtectedRoute>} />


            {/* Rutas administrativas - Protegidas */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><PaginaAdministrativa /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/deslinde" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Deslinde /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/perfil" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><PerfilEmpresa /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/politicas" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Politicas /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/terminos" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><TerminosCondiciones /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/redesSociales" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><RedesSociales /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Reportes /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/contactanosadmin" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Contactanosadmin /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/Productosadmin" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><ProductosAdmin /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/categorias" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Categorias /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/colores" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Colores /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/tallas" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Tallas /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/generos" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Generos /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/faqsadmin" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><FaqsAdmin /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/ventas" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Ventas /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/banner" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><Banner /></LayoutEncabezadoAdmin></ProtectedRoute>} />
            <Route path="/admin/promocionAdmin" element={<ProtectedRoute requiredRole="admin"><LayoutEncabezadoAdmin><PromocionAdmin /></LayoutEncabezadoAdmin></ProtectedRoute>} />

            {/* Rutas Empleado - Protegidas */}
            <Route path="/empleado" element={<ProtectedRoute requiredRole="empleado"><LayoutEncabezadoEmpleado><PaginaEmpleado /></LayoutEncabezadoEmpleado></ProtectedRoute>} />

            {/* Ruta 404 - debe ser la última */}
            <Route path="*" element={<LayoutEncabezado><Error404 /></LayoutEncabezado>} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
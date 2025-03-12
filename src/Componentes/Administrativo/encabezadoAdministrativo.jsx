import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GavelIcon from '@mui/icons-material/Gavel';
import PolicyIcon from '@mui/icons-material/Policy';
import SecurityIcon from '@mui/icons-material/Security'; // Para Deslinde Legal
import BusinessIcon from '@mui/icons-material/Business'; // Para Perfil de Empresa
import ShareIcon from '@mui/icons-material/Share';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category'; // Para Categorías
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Para Preguntas Frecuentes
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';

const theme = createTheme({
  palette: {
    primary: { main: '#1E90FF' },
    secondary: { main: '#4682B4' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '8px 16px',
          transition: '0.3s',
          '&:hover': {
            backgroundColor: '#357ABD'
          }
        }
      }
    }
  }
});

const EncabezadoAdministrativo = () => {
  const [anchorElDocs, setAnchorElDocs] = useState(null); // Menú de Documentos
  const [anchorElProducts, setAnchorElProducts] = useState(null); // Menú de Productos
  const [anchorElContact, setAnchorElContact] = useState(null); // Menú de Soporte
  const navigate = useNavigate();

  const handleMenuOpenDocs = (event) => setAnchorElDocs(event.currentTarget);
  const handleMenuCloseDocs = () => setAnchorElDocs(null);

  const handleMenuOpenProducts = (event) => setAnchorElProducts(event.currentTarget);
  const handleMenuCloseProducts = () => setAnchorElProducts(null);

  const handleMenuOpenContact = (event) => setAnchorElContact(event.currentTarget);
  const handleMenuCloseContact = () => setAnchorElContact(null);

  const handleMenuClick = (route) => {
    navigate(route);
    handleMenuCloseDocs();
    handleMenuCloseProducts();
    handleMenuCloseContact();
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ padding: '8px 16px' }}>
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="Gislive" style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 16 }} />
            <Typography variant="h6">Gislive Boutique Clínica</Typography>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" onClick={() => handleMenuClick('/admin/reportes')}>Reportes</Button>
            <Button color="inherit" onClick={handleMenuOpenContact}>Soporte</Button>
            <Button color="inherit" onClick={handleMenuOpenProducts}>Gestión de productos</Button>
            <Button color="inherit" onClick={handleMenuOpenDocs}>Documentos</Button>
            <Button color="secondary" variant="contained" onClick={() => handleMenuClick('/')}
              startIcon={<LogoutIcon />} sx={{ marginLeft: 2 }}>Cerrar Sesión</Button>
          </Box>
          
          <IconButton color="inherit" sx={{ display: { xs: 'flex', md: 'none' } }} onClick={handleMenuOpenDocs}>
            <MenuIcon />
          </IconButton>

          {/* Menú de Documentos */}
          <Menu anchorEl={anchorElDocs} open={Boolean(anchorElDocs)} onClose={handleMenuCloseDocs}>
            <MenuItem onClick={() => handleMenuClick('/admin/politicas')}>
              <PolicyIcon sx={{ marginRight: 1 }} /> Políticas
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/terminos')}>
              <GavelIcon sx={{ marginRight: 1 }} /> Términos y Condiciones
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/deslinde')}>
              <SecurityIcon sx={{ marginRight: 1 }} /> Deslinde Legal
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/perfil')}>
              <BusinessIcon sx={{ marginRight: 1 }} /> Perfil de Empresa
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/redesSociales')}>
              <ShareIcon sx={{ marginRight: 1 }} /> Redes Sociales
            </MenuItem>
          </Menu>

          {/* Menú de Gestión de Productos */}
          <Menu anchorEl={anchorElProducts} open={Boolean(anchorElProducts)} onClose={handleMenuCloseProducts}>
            <MenuItem onClick={() => handleMenuClick('/admin/Productosadmin')}>
              <InventoryIcon sx={{ marginRight: 1 }} /> Productos
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/categorias')}>
              <CategoryIcon sx={{ marginRight: 1 }} /> Categorías
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/colores')}>
              <CategoryIcon sx={{ marginRight: 1 }} /> Colores
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/tallas')}>
              <CategoryIcon sx={{ marginRight: 1 }} /> Tallas
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/generos')}>
              <CategoryIcon sx={{ marginRight: 1 }} /> Generos
            </MenuItem>
          </Menu>

          {/* Menú de Soporte */}
          <Menu anchorEl={anchorElContact} open={Boolean(anchorElContact)} onClose={handleMenuCloseContact}>
            <MenuItem onClick={() => handleMenuClick('/admin/contactanosadmin')}>
              <ContactMailIcon sx={{ marginRight: 1 }} /> Contáctanos
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/faqsadmin')}>
              <HelpOutlineIcon sx={{ marginRight: 1 }} /> Preguntas Frecuentes
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default EncabezadoAdministrativo;
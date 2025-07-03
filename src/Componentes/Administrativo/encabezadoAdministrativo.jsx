import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useMediaQuery,
  ListItemButton,
  Avatar,
  Collapse
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Iconos
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import GavelIcon from '@mui/icons-material/Gavel';
import PolicyIcon from '@mui/icons-material/Policy';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import ShareIcon from '@mui/icons-material/Share';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ColorLensIcon from '@mui/icons-material/ColorLens'; // Ícono para Colores
import StraightenIcon from '@mui/icons-material/Straighten'; // Ícono para Tallas
import TransgenderIcon from '@mui/icons-material/Transgender'; // Ícono para Géneros
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WebAssetIcon from "@mui/icons-material/WebAsset";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';


import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../Autenticacion/AuthContext';

// Importar logo
// Asegúrate de que la ruta sea correcta
import logo from '../imagenes/LogoGL.jpg';

// Ancho del drawer
const drawerWidth = 280;

// Tema personalizado
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
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(30, 144, 255, 0.1)'
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }
    }
  }
});

/**
 * Componente de encabezado administrativo con navegación lateral
 * Implementa un panel lateral permanente en escritorio y desplegable en móvil
 * Solo permite tener un menú expandido a la vez
 */
const EncabezadoAdministrativo = () => {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const navigate = useNavigate();
  const themeInstance = useTheme();
  const isMobile = useMediaQuery(themeInstance.breakpoints.down('md'));

  const handleLogout = async () => {
    try {
      await logout(); // La función logout del contexto se encargará de redirigir
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  // Manejadores de eventos
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (route) => {
    navigate(route);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleMenuExpand = (menuId) => {
    // Si el menú ya está activo, lo cerramos
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      // Si no, activamos este y cerramos los demás
      setActiveMenu(menuId);
    }
  };

  // Configuración de los menús
  const menuGroups = [
    {
      id: 'banner',
      title: 'banner',
      icon: WebAssetIcon,
      items: [
        { icon: WebAssetIcon, text: 'banner', path: '/admin/banner' },
      ]
    },
    {
      id: 'products',
      title: 'Gestión de productos',
      icon: InventoryIcon,
      items: [
        { icon: InventoryIcon, text: 'Productos', path: '/admin/Productosadmin' },
        { icon: CategoryIcon, text: 'Categorías', path: '/admin/categorias' },
        { icon: ColorLensIcon, text: 'Colores', path: '/admin/colores' },
        { icon: StraightenIcon, text: 'Tallas', path: '/admin/tallas' },
        { icon: TransgenderIcon, text: 'Géneros', path: '/admin/generos' },
        { icon: LocalOfferIcon, text: 'Promoción', path: '/admin/promocionAdmin' },
      ]
    },
    {
      id: 'ventas',
      title: 'Ventas',
      icon: MonetizationOnIcon,
      items: [
        { icon: MonetizationOnIcon, text: 'Ventas', path: '/admin/ventas' },

      ]
    },
    {
      id: 'support',
      title: 'Soporte',
      icon: ContactMailIcon,
      items: [
        { icon: ContactMailIcon, text: 'Contáctanos', path: '/admin/contactanosadmin' },
        { icon: HelpOutlineIcon, text: 'Preguntas Frecuentes', path: '/admin/faqsadmin' }
      ]
    },
    {
      id: 'documents',
      title: 'Documentos',
      icon: BusinessIcon,
      items: [
        { icon: PolicyIcon, text: 'Políticas', path: '/admin/politicas' },
        { icon: GavelIcon, text: 'Términos y Condiciones', path: '/admin/terminos' },
        { icon: SecurityIcon, text: 'Deslinde Legal', path: '/admin/deslinde' },
        { icon: BusinessIcon, text: 'Perfil de Empresa', path: '/admin/perfil' },
        { icon: ShareIcon, text: 'Redes Sociales', path: '/admin/redesSociales' }
      ]
    },
    {
      id: 'reportes',
      title: 'Reportes',
      icon: BusinessIcon,
      items: [
        { icon: AssessmentIcon, text: 'Reportes', path: '/admin/reportes' },
      ]
    },
  ];

  // Contenido del drawer
  const drawerContent = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Icono y título del panel */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Avatar
          sx={{
            width: 70,
            height: 70,
            bgcolor: 'primary.main',
            mb: 1
          }}
        >
          <PersonIcon sx={{ fontSize: 35 }} />
        </Avatar>
        <Typography variant="subtitle1" fontWeight="medium" align="center">
          Panel Administrativo
        </Typography>
      </Box>

      <Divider />


      <Divider />

      {/* Menús agrupados */}
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List>
          {menuGroups.map((group) => (
            <React.Fragment key={group.id}>
              <ListItemButton
                onClick={() => handleMenuExpand(group.id)}
                sx={{
                  py: 1.5,
                  borderRadius: '0 20px 20px 0',
                  mr: 1,
                  bgcolor: activeMenu === group.id ? 'rgba(30, 144, 255, 0.1)' : 'transparent'
                }}
              >
                <ListItemIcon>
                  <group.icon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={group.title}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
                {activeMenu === group.id ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={activeMenu === group.id} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {group.items.map((item, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() => handleMenuClick(item.path)}
                      sx={{
                        pl: 4,
                        py: 1,
                        borderRadius: '0 20px 20px 0',
                        mr: 1,
                        ml: 1
                      }}
                    >
                      <ListItemIcon>
                        <item.icon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>

              <Divider sx={{ my: 1 }} />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Botón de cerrar sesión en la parte inferior */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          mt: 'auto'
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout} // Cambiado de handleMenuClick('/') a handleLogout
          sx={{ py: 1 }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* AppBar - siempre visible y ocupa todo el ancho */}
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            boxShadow: 1,
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}
        >
          <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
            {/* Botón de menú móvil */}
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo y nombre de la aplicación */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Avatar
                src={logo}
                alt="Gislive"
                sx={{
                  width: 40,
                  height: 40,
                  mr: 1.5,
                  border: '2px solid rgba(255, 255, 255, 0.6)'
                }}
              />
              <Typography variant="h6" component="div" fontWeight="500">
                Gislive Boutique
              </Typography>
            </Box>

            {/* Icono de inicio a la derecha */}
            <IconButton
              color="inherit"
              onClick={() => handleMenuClick('/admin')}
              sx={{
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <HomeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer - Permanente en escritorio, Temporal en móvil */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? drawerOpen : true}
          onClose={isMobile ? handleDrawerToggle : undefined}
          ModalProps={{
            keepMounted: true // Mejor rendimiento en móviles
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              mt: '64px', // Altura del AppBar
              pt: 0, // Sin padding en el top
              height: 'calc(100% - 64px)', // Altura total menos el AppBar
              borderRight: '1px solid rgba(0,0,0,0.12)'
            }
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            marginLeft: { xs: 0, md: `${drawerWidth}px` },
            marginTop: '64px', // Altura del AppBar
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            })
          }}
        >
          {/* El contenido de la página se renderizará aquí */}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default EncabezadoAdministrativo;

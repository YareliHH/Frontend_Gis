import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  Tooltip,
  Avatar,
  useMediaQuery,
  Badge,
  Collapse,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GavelIcon from '@mui/icons-material/Gavel';
import PolicyIcon from '@mui/icons-material/Policy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ShareIcon from '@mui/icons-material/Share';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import logo from '../imagenes/LogoGL.jpg';

const theme = createTheme({
  palette: {
    primary: { 
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: { 
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777', 
    },
    background: { 
      default: '#F9FAFB', 
      paper: '#FFFFFF',
    },
    text: { 
      primary: '#111827', 
      secondary: '#6B7280',
      sidebar: '#FFFFFF' 
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', 'Roboto', sans-serif",
    h5: { 
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h6: { 
      fontWeight: 600,
      fontSize: '1.15rem',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    ...Array(21).fill('').map((_, i) => i > 3 ? createTheme().shadows[i] : '')
  ],
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'linear-gradient(to bottom,rgb(115, 183, 199),rgb(175, 176, 232))',
          color: '#FFFFFF',
          borderRight: 'none'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          margin: '4px 8px',
          transition: 'all 0.2s ease'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 16px',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.15)'
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.25)'
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111827',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          borderRadius: '16px',
          border: '1px solid rgba(229, 231, 235, 0.5)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px -1px rgba(0, 0, 0, 0.08), 0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(to right, #4F46E5, #6366F1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundImage: 'linear-gradient(to right, #4338CA, #4F46E5)',
          }
        }
      }
    },
    MuiBadge: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#EC4899'
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '10px 16px',
          borderRadius: '8px',
          margin: '2px 4px',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)'
          }
        }
      }
    }
  },
});

const PanelAdministrativo = () => {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [productsOpen, setProductsOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const navigate = useNavigate();
  const themeInstance = useTheme();
  const isMobile = useMediaQuery(themeInstance.breakpoints.down('md'));

  const handleProfileMenuOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const handleMenuClick = (route, item) => {
    navigate(route);
    if (item) setSelectedItem(item);
    handleProfileMenuClose();
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const toggleProductsMenu = () => {
    setProductsOpen(!productsOpen);
  };

  const toggleDocumentsMenu = () => {
    setDocumentsOpen(!documentsOpen);
  };

  // Contenido del Drawer
  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo y título */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        p: 3,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Avatar 
          src={logo} 
          alt="GisLive" 
          sx={{ 
            width: 40, 
            height: 40, 
            mr: 2,
            backgroundColor: 'white',
            p: 0.5,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }} 
        />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: '-0.02em' }}>
          GisLive
        </Typography>
      </Box>
      
      {/* Lista de opciones principales */}
      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            selected={selectedItem === 'Reportes'}
            onClick={() => handleMenuClick('/admin/reportes', 'Reportes')}
          >
            <ListItemIcon><DashboardIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText 
              primary="Reportes" 
              primaryTypographyProps={{ 
                sx: { fontWeight: selectedItem === 'dashboard' ? 600 : 400 } 
              }}
            />
          </ListItemButton>
        </ListItem>
        
        {/* Gestión de Productos con submenú en forma de lista */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            selected={selectedItem === 'productos'}
            onClick={toggleProductsMenu}
          >
            <ListItemIcon><InventoryIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText 
              primary="Gestión de Productos" 
              primaryTypographyProps={{ 
                sx: { fontWeight: selectedItem === 'products' ? 600 : 400 } 
              }}
            />
            {productsOpen ? 
              <ExpandLessIcon sx={{ color: 'white', fontSize: 20 }} /> : 
              <ExpandMoreIcon sx={{ color: 'white', fontSize: 20 }} />
            }
          </ListItemButton>
        </ListItem>
        
        <Collapse in={productsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={selectedItem === 'productosadmin'}
              onClick={() => handleMenuClick('/admin/Productosadmin', 'productosadmin')}
            >
              <ListItemIcon><AddIcon sx={{ color: 'white', fontSize: 20 }} /></ListItemIcon>
              <ListItemText 
                primary="Productos" 
                primaryTypographyProps={{ 
                  sx: { fontSize: '0.9rem' } 
                }}
              />
            </ListItemButton>
            
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={selectedItem === 'productos'}
              onClick={() => handleMenuClick('/admin/categorias', 'categorias')}
            >
              <ListItemIcon><EditIcon sx={{ color: 'white', fontSize: 20 }} /></ListItemIcon>
              <ListItemText 
                primary="Categorias" 
                primaryTypographyProps={{ 
                  sx: { fontSize: '0.9rem' } 
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
        
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            selected={selectedItem === 'contact'}
            onClick={() => handleMenuClick('/admin/contactanosadmin', 'contact')}
          >
            <ListItemIcon><ContactSupportIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText 
              primary="Contáctanos" 
              primaryTypographyProps={{ 
                sx: { fontWeight: selectedItem === 'contact' ? 600 : 400 } 
              }}
            />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            selected={selectedItem === 'profile'}
            onClick={() => handleMenuClick('/admin/perfil', 'profile')}
          >
            <ListItemIcon><PersonIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText 
              primary="Perfil" 
              primaryTypographyProps={{ 
                sx: { fontWeight: selectedItem === 'profile' ? 600 : 400 } 
              }}
            />
          </ListItemButton>
        </ListItem>
        
        {/* Documentos con submenú en forma de lista */}
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            selected={selectedItem === 'documents'}
            onClick={toggleDocumentsMenu}
          >
            <ListItemIcon><PolicyIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText 
              primary="Documentos" 
              primaryTypographyProps={{ 
                sx: { fontWeight: selectedItem === 'documents' ? 600 : 400 } 
              }}
            />
            {documentsOpen ? 
              <ExpandLessIcon sx={{ color: 'white', fontSize: 20 }} /> : 
              <ExpandMoreIcon sx={{ color: 'white', fontSize: 20 }} />
            }
          </ListItemButton>
        </ListItem>
        
        <Collapse in={documentsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={selectedItem === 'documents-policies'}
              onClick={() => handleMenuClick('/admin/politicas', 'documents-policies')}
            >
              <ListItemIcon><PolicyIcon sx={{ color: 'white', fontSize: 20 }} /></ListItemIcon>
              <ListItemText 
                primary="Políticas" 
                primaryTypographyProps={{ 
                  sx: { fontSize: '0.9rem' } 
                }}
              />
            </ListItemButton>
            
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={selectedItem === 'documents-terms'}
              onClick={() => handleMenuClick('/admin/terminos', 'documents-terms')}
            >
              <ListItemIcon><GavelIcon sx={{ color: 'white', fontSize: 20 }} /></ListItemIcon>
              <ListItemText 
                primary="Términos y Condiciones" 
                primaryTypographyProps={{ 
                  sx: { fontSize: '0.9rem' } 
                }}
              />
            </ListItemButton>
            
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={selectedItem === 'documents-legal'}
              onClick={() => handleMenuClick('/admin/deslinde', 'documents-legal')}
            >
              <ListItemIcon><AccountCircleIcon sx={{ color: 'white', fontSize: 20 }} /></ListItemIcon>
              <ListItemText 
                primary="Deslinde Legal" 
                primaryTypographyProps={{ 
                  sx: { fontSize: '0.9rem' } 
                }}
              />
            </ListItemButton>
            
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={selectedItem === 'documents-social'}
              onClick={() => handleMenuClick('/admin/redesSociales', 'documents-social')}
            >
              <ListItemIcon><ShareIcon sx={{ color: 'white', fontSize: 20 }} /></ListItemIcon>
              <ListItemText 
                primary="Redes Sociales" 
                primaryTypographyProps={{ 
                  sx: { fontSize: '0.9rem' } 
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            selected={selectedItem === 'settings'}
            onClick={() => handleMenuClick('/admin/configuracion', 'settings')}
          >
            <ListItemIcon><SettingsIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText 
              primary="Configuración" 
              primaryTypographyProps={{ 
                sx: { fontWeight: selectedItem === 'settings' ? 600 : 400 } 
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Cerrar sesión */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleMenuClick('/')}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              }
            }}
          >
            <ListItemIcon><LogoutIcon sx={{ color: 'white' }} /></ListItemIcon>
            <ListItemText 
              primary="Cerrar Sesión" 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: '100%',
            top: 0,
            left: 0,
            backgroundColor: '#FFFFFF',
            color: '#111827',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}            
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Panel Administrativo
            </Typography>
            
            <Tooltip title="Notificaciones">
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Perfil">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  aria-controls="menu-perfil"
                  sx={{ 
                    p: 0.5,
                    border: '2px solid rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      border: '2px solid rgba(99, 102, 241, 0.5)',
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)',
                      fontWeight: 600
                    }}
                    alt="Administrador"
                  >
                    A
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Drawer lateral */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              [`& .MuiDrawer-paper`]: { 
                width: 280, 
                boxSizing: 'border-box', 
                top: '64px', 
                height: 'calc(100% - 64px)' 
              }
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: 280,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { 
                width: 280, 
                boxSizing: 'border-box', 
                position: 'fixed', 
                top: '64px', 
                height: 'calc(100% - 64px)', 
                left: 0 
              }
            }}
          >
            {drawerContent}
          </Drawer>
        )}

      </Box>

      {/* Menú de Perfil */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 220, mt: 0.5, boxShadow: theme.shadows[2] }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Admin Usuario
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleMenuClick('/admin/perfil', 'profile')}>
          <PersonIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="body2">Mi Perfil</Typography>
        </MenuItem>
        <Divider />
      </Menu>
    </ThemeProvider>
  );
};

export default PanelAdministrativo;
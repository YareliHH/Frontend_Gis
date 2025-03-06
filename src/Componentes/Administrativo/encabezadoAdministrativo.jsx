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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuClick = (route) => {
    navigate(route);
    handleMenuClose();
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
            <Button color="inherit" onClick={() => handleMenuClick('/admin/contactanosadmin')}>Contáctanos</Button>
            <Button color="inherit" onClick={() => handleMenuClick('/admin/Productosadmin')}>Gestion d productos</Button>
            <Button color="inherit" onClick={() => handleMenuClick('/admin/perfil')}>Perfil</Button>
            <Button color="inherit" onClick={handleMenuOpen}>Documentos</Button>
            <Button color="secondary" variant="contained" onClick={() => handleMenuClick('/')}
              startIcon={<LogoutIcon />} sx={{ marginLeft: 2 }}>Cerrar Sesión</Button>
          </Box>
          
          <IconButton color="inherit" sx={{ display: { xs: 'flex', md: 'none' } }} onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleMenuClick('/admin/politicas')}><PolicyIcon sx={{ marginRight: 1 }} /> Políticas</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/terminos')}><GavelIcon sx={{ marginRight: 1 }} /> Términos y Condiciones</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/deslinde')}><AccountCircleIcon sx={{ marginRight: 1 }} /> Deslinde Legal</MenuItem>
            <MenuItem onClick={() => handleMenuClick('/admin/redesSociales')}><ShareIcon sx={{ marginRight: 1 }} /> Redes Sociales</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default EncabezadoAdministrativo;

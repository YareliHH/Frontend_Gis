import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { HomeOutlined, UserOutlined, PhoneOutlined, AppstoreOutlined, LogoutOutlined, DescriptionOutlined } from '@mui/icons-material'; // Cambié FileTextOutlined por DescriptionOutlined
import { useNavigate } from 'react-router-dom';
import logo from '../imagenes/LogoGL.png';

const EncabezadoAdministrativo = () => {
  const [active, setActive] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); 

  const handleClick = (option) => {
    setActive(option);
    setIsMobileMenuOpen(false); 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case "politicas":
        navigate('/admin/politicas');
        break;
      case "terminos":
        navigate('/admin/terminos');
        break;
      case "perfil":
        navigate('/admin/perfil');
        break;
      case "deslinde":
        navigate('/admin/deslinde');
        break;
      case "quienesSomos":
        navigate('/admin/informacion/lista-quienes-somos');
        break;
      case "cerrarSesion":
        console.log('Cerrando sesión...');
        navigate('/');
        break;
      default:
        console.log("No se reconoce la acción del menú");
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#FFFFFF' }}>
            Gislive Boutique
          </Typography>
          <IconButton color="inherit" onClick={toggleMobileMenu}>
            <img src={logo} alt="Gislive Boutique Clínica" style={{ width: 80, height: 60, marginRight: 16 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer anchor="right" open={isMobileMenuOpen} onClose={toggleMobileMenu}>
        <List>
          {['politicas', 'terminos', 'perfil', 'deslinde', 'cerrarSesion'].map((text, index) => (
            <ListItem button key={text} onClick={() => { handleClick(text); handleMenuClick(text); }}>
              <ListItemIcon>
                {index === 0 ? <DescriptionOutlined /> :  // Cambié aquí el ícono de FileTextOutlined por DescriptionOutlined
                 index === 1 ? <AppstoreOutlined /> :
                 index === 2 ? <UserOutlined /> :
                 index === 3 ? <PhoneOutlined /> :
                 <LogoutOutlined />}
              </ListItemIcon>
              <ListItemText primary={text.charAt(0).toUpperCase() + text.slice(1)} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default EncabezadoAdministrativo;

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

// Importar imágenes
import img14 from '../imagenes/img14.jpg';
import img25h from '../imagenes/img25h.jpg';
import img5 from '../imagenes/img5.jpg';
import img4 from '../imagenes/img4.jpg';
import img17h from '../imagenes/img17h.jpg';
import img6 from '../imagenes/img6.jpg';
import img16 from '../imagenes/img16.jpg';
import img7 from '../imagenes/img7.jpg';

const Hombre = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate(); // Actualización aquí

  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchDarkTheme.matches);
    const handleThemeChange = (e) => setIsDarkMode(e.matches);
    matchDarkTheme.addEventListener('change', handleThemeChange);
    return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
  }, []);

  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    primaryText: '#000000',
  };

  const products = [
    { image: img25h, name: "Uniforme Clínico VitalCare Azul Claro (Poliéster y Algodón)", price: "$50", type: "Clínico", stock: "En Stock" },
    { image: img5, name: "Uniforme Clínico MedFit Verde Oscuro (Algodón 100%)", price: "$80", type: "Quirúrgico", stock: "Últimas piezas" },
    { image: img4, name: "Uniforme Clínico PureCare Blanco (Poliéster y Spandex)", price: "$45", type: "Clínico", stock: "Agotado" },
    { image: img14, name: "Uniforme Clínico SurgicalPro Gris Claro (Poliéster)", price: "$15", type: "Quirúrgico", stock: "En Stock" },
    { image: img17h, name: "Uniforme Clínico CareFlex Rosa Pastel (Poliéster y Algodón)", price: "$12", type: "Quirúrgico", stock: "En Stock" },
    { image: img6, name: "Uniforme Clínico ProActive Azul Marino (Algodón y Elastano)", price: "$20", type: "Clínico", stock: "Últimas piezas" },
    { image: img16, name: "Uniforme Clínico ComfortCare Lavanda (Poliéster)", price: "$70", type: "Quirúrgico", stock: "En Stock" },
    { image: img7, name: "Uniforme Clínico SanoTech Naranja (Spandex y Poliéster)", price: "$30", type: "Clínico", stock: "Últimas piezas" }
  ];

  const handleProductClick = (product) => {
    navigate('/detalles-producto', { state: { product } }); // Actualización aquí
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Título */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" sx={{ color: colors.primaryText, fontWeight: 'bold', fontFamily: 'Roboto Serif, serif' }}>
          Vistiendo Profesionales
        </Typography>
      </Box>
      {/* Subtítulo */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            color: colors.primaryText,
            fontFamily: 'Roboto", "Helvetica", "Arial", sans-serif',
            fontStyle: 'italic',
          }}
        >
          Boutique Clínica Creamos Uniformes de alta gama, dirigida a los profesionales de la salud.
        </Typography>
      </Box>

      {/* Productos */}
      <Grid container spacing={4} justifyContent="center">
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              {/* Etiqueta de disponibilidad */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  backgroundColor: product.stock === "En Stock" ? 'green' : product.stock === "Últimas piezas" ? 'orange' : 'red',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '12px',
                }}
              >
                {product.stock}
              </Box>
              {/* Imagen del producto */}
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '80%', height: 'auto', borderRadius: '10px', margin: '0 auto', display: 'block' }}
              />
              {/* Nombre del producto como enlace */}
              <Typography
              variant="h6"
              component="a"
              onClick={() => handleProductClick(product)}  // Asegúrate de que el manejador de clic esté configurado
              sx={{
                color: colors.primaryText,
                mt: 2,
                fontFamily: 'Montserrat, sans-serif',
                textAlign: 'center',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': { color: 'blue' }
              }}
              >
                {product.name}
              </Typography>
              {/* Precio y tipo */}
              <Typography variant="body2" sx={{ color: colors.primaryText, fontWeight: 'bold', fontFamily: 'Roboto", "Helvetica", "Arial", sans-serif', textAlign: 'center' }}>
                {product.price}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.primaryText, fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
                Tipo: {product.type}
              </Typography>
              {/* Icono de carrito */}
              <ShoppingCartIcon sx={{ mt: 1, color: 'gray', cursor: 'pointer', '&:hover': { color: 'black' } }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Hombre;
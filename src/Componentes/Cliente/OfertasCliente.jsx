import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

// Importar imágenes
import img14 from '../imagenes/img14.jpg';
import img9 from '../imagenes/img9.jpg';
import img17h from '../imagenes/img17h.jpg';
import img20 from '../imagenes/img20.jpg';
import img21 from '../imagenes/img21.jpg';
import img5 from '../imagenes/img5.jpg';
import img22 from '../imagenes/img22.jpg';
import img4 from '../imagenes/img4.jpg';

const OfertasCliente = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

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
    { image: img9, name: "Uniforme Clínico", price: "$50", discount: "10%", type: "Clínico", stock: "En Stock" },
    { image: img17h, name: "Batas Quirúrgicas", price: "$80", discount: "15%", type: "Quirúrgico", stock: "Últimas piezas" },
    { image: img20, name: "Camisón Médico", price: "$45", discount: "5%", type: "Clínico", stock: "Agotado" },
    { image: img14, name: "Mascarilla Quirúrgica", price: "$15", discount: "20%", type: "Quirúrgico", stock: "En Stock" },
    { image: img21, name: "Gorro Quirúrgico", price: "$12", discount: "", type: "Quirúrgico", stock: "En Stock" },
    { image: img5, name: "Guantes Clínicos", price: "$20", discount: "10%", type: "Clínico", stock: "Últimas piezas" },
    { image: img22, name: "Bata Estéril", price: "$70", discount: "", type: "Quirúrgico", stock: "En Stock" },
    { image: img4, name: "Zapatillas Médicas", price: "$30", discount: "5%", type: "Clínico", stock: "Últimas piezas" }
  ];

  const handleProductClick = (product) => {
    navigate('/detalles-ofertas', { state: { product } });
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" sx={{ color: colors.primaryText, fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif' }}>
          Hay una promoción especial para clientes nuevos
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center', mb: 5 }}>

      </Box>
      <Grid container spacing={4} justifyContent="center">
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              {/* Etiqueta de descuento en la parte superior */}
              {product.discount && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'blue',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                  }}
                >
                  {`Descuento ${product.discount}`}
                </Box>
              )}

              <img
                src={product.image}
                alt={product.name}
                style={{ width: '80%', height: 'auto', borderRadius: '10px', margin: '0 auto', display: 'block' }}
              />

              {/* Etiqueta de stock en la parte inferior */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 130,
                  left: 20,
                  backgroundColor: product.stock === "En Stock" ? 'green' : product.stock === "Últimas piezas" ? 'orange' : 'red',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '12px',
                }}
              >
                {product.stock}
              </Box>

              <Typography
                variant="h6"
                component="a"
                onClick={() => handleProductClick(product)}
                sx={{
                  color: colors.primaryText,
                  mt: 2,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': { color: 'blue' }
                }}
              >
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.primaryText, fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
                {product.price}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.primaryText, fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
                Tipo: {product.type}
              </Typography>
              <ShoppingCartIcon sx={{ mt: 1, color: 'gray', cursor: 'pointer', '&:hover': { color: 'black' } }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OfertasCliente;


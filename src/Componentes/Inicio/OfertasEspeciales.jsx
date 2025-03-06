import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';

// Importar imágenes locales de los productos
import img14 from '../imagenes/img14.jpg';
import img9 from '../imagenes/img9.jpg';
import img17h from '../imagenes/img17h.jpg';
import img20 from '../imagenes/img20.jpg';
import img21 from '../imagenes/img21.jpg';
import img5 from '../imagenes/img5.jpg';
import img22 from '../imagenes/img22.jpg';
import img4 from '../imagenes/img4.jpg';

const OfertasEspeciales = () => {
  const colors = {
    primaryText: '#000000',
    highlightText: '#1565C0', // Azul para resaltar títulos en hover
  };

  const products = [
    { image: img9, name: "Uniforme Clínico", price: "$50", type: "Clínico" },
    { image: img17h, name: "Batas Quirúrgicas", price: "$80", type: "Quirúrgico" },
    { image: img20, name: "Camisón Médico", price: "$45", type: "Clínico" },
    { image: img14, name: "Mascarilla Quirúrgica", price: "$15", type: "Quirúrgico" }
  ];

  const newProducts = [
    { image: img21, name: "Gorro Quirúrgico", price: "$12", type: "Quirúrgico" },
    { image: img5, name: "Guantes Clínicos", price: "$20", type: "Clínico" },
    { image: img22, name: "Bata Estéril", price: "$70", type: "Quirúrgico" },
    { image: img4, name: "Zapatillas Médicas", price: "$30", type: "Clínico" }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Sección de Productos */}
      <Grid container spacing={4} justifyContent="center">
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                textAlign: 'center',
                padding: '15px',
                borderRadius: '10px',
                transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: colors.primaryText,
                  mt: 2,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                  transition: 'color 0.3s ease-in-out',
                  '&:hover': {
                    color: colors.highlightText,
                  },
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryText,
                  marginBottom: 1,
                  fontWeight: 'bold',
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                {product.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryText,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                Tipo: {product.type}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Sección de Nuevos Productos */}
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {newProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                textAlign: 'center',
                padding: '15px',
                borderRadius: '10px',
                transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: colors.primaryText,
                  mt: 2,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                  transition: 'color 0.3s ease-in-out',
                  '&:hover': {
                    color: colors.highlightText,
                  },
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryText,
                  marginBottom: 1,
                  fontWeight: 'bold',
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                {product.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.primaryText,
                  fontFamily: 'Roboto Serif, serif',
                  textAlign: 'center',
                }}
              >
                Tipo: {product.type}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OfertasEspeciales;

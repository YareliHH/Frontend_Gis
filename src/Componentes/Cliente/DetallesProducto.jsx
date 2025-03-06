import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Grid, Divider, Button, IconButton, Chip } from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';

const DetallesProducto = () => {
  const location = useLocation();
  const { product } = location.state || {};

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  if (!product) {
    return <Typography variant="h6" sx={{ textAlign: 'center' }}>Producto no encontrado</Typography>;
  }

  // Asegúrate de que 'product.imageDescriptions' esté definido y tenga al menos un valor
  const imageDescription = product.imageDescriptions && product.imageDescriptions[0];

  const handleAddToCart = () => {
    console.log('Producto agregado al carrito:', { product, selectedSize, selectedColor, selectedQuantity });
  };

  // Opciones de colores
  const colorOptions = [
    { name: 'Azul', colorCode: '#0000FF' },
    { name: 'Rosa', colorCode: '#FF1493' },
    { name: 'Rojo', colorCode: '#FF0000' },
    { name: 'Verde', colorCode: '#00FF00' },
    { name: 'Blanco', colorCode: '#FFFFFF' },
    { name: 'Negro', colorCode: '#000000' },
  ];

  return (
    <Box padding={3} sx={{ backgroundColor: '#f9f9f9' }}>
      <Grid container spacing={4} alignItems="center">
        {/* Imagen del producto a la izquierda */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{
              width: '70%', 
              maxWidth: '400px', 
              height: 'auto', 
              display: 'block', 
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }} 
          />
          {/* Descripción de la imagen, si existe */}
          {imageDescription && (
            <Typography variant="body2" sx={{ color: 'black', marginTop: '10px' }}>
              {imageDescription}
            </Typography>
          )}
        </Grid>

        {/* Información del producto al lado derecho */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '16px' }}>
            {product.name}
          </Typography>

          {/* Descripción del producto (debajo del nombre) */}
          <Typography variant="body2" sx={{ color: 'black', marginBottom: '20px' }}>
            {product.description}
          </Typography>

          {/* Descripción adicional debajo de la descripción principal */}
          <Typography variant="body2" sx={{ color: 'black', marginBottom: '20px' }}>
            Tipo de tela: Algodón 100%, ideal para climas cálidos. Confortable y resistente para uso prolongado.
            <br />
            Otras características: Resistente al lavado frecuente, transpirable, y con acabado suave al tacto.
          </Typography>

          <Divider sx={{ marginBottom: '20px' }} />

          {/* Filtro de talla */}
          <Grid item xs={12} sx={{ marginBottom: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '8px' }}>Talla</Typography>
            <Grid container spacing={2}>
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <Grid item key={size}>
                  <Chip
                    label={size}
                    onClick={() => setSelectedSize(size)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '50%',
                      padding: '5px',
                      border: selectedSize === size ? '2px solid #4A90E2' : '1px solid #ccc',
                      backgroundColor: selectedSize === size ? '#4A90E2' : 'transparent',
                      color: selectedSize === size ? 'white' : 'black',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Filtro de color */}
          <Grid item xs={12} sx={{ marginBottom: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '8px' }}>Color</Typography>
            <Grid container spacing={2}>
              {colorOptions.map(({ name, colorCode }) => (
                <Grid item key={name}>
                  <IconButton
                    onClick={() => setSelectedColor(name)}
                    sx={{
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      backgroundColor: colorCode,
                      border: selectedColor === name ? '3px solid #4A90E2' : 'none',
                      boxShadow: selectedColor === 'Blanco' ? '0px 0px 8px 2px rgba(0, 0, 0, 0.2)' : 'none', // Resaltar el blanco
                      '&:hover': { opacity: 0.8 },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Filtro de cantidad */}
          <Grid item xs={12} sx={{ marginBottom: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '8px' }}>Cantidad</Typography>
            <Grid container alignItems="center">
              <Grid item>
                <IconButton onClick={() => setSelectedQuantity(selectedQuantity > 1 ? selectedQuantity - 1 : 1)}>
                  <Remove />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h6" sx={{ marginX: '10px', color: 'black' }}>{selectedQuantity}</Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => setSelectedQuantity(selectedQuantity + 1)}>
                  <Add />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ marginBottom: '20px' }} />

          {/* Botón de agregar al carrito */}
          <Button 
            variant="contained" 
            sx={{
              width: '40%', 
              backgroundColor: '#4A90E2', 
              '&:hover': { backgroundColor: '#357ABD' }, 
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={handleAddToCart}
          >
            <ShoppingCart sx={{ marginRight: '8px' }} />
            Agregar al carrito
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetallesProducto;


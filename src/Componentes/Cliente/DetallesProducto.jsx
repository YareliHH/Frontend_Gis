import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Divider, Button, IconButton, Chip } from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';
import axios from 'axios';  // Asegúrate de tener axios instalado para las peticiones HTTP

const DetallesProducto = () => {
  const { id } = useParams();  // Usamos useParams para obtener el id del producto desde la URL
  const [product, setProduct] = useState(null);  // Guardamos los detalles del producto en el estado
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Obtener los detalles del producto cuando se carga el componente
  useEffect(() => {
    // Realizar la petición a la API para obtener los detalles del producto
    axios.get(`http://localhost:3001/api/producto-detalle/${id}`)
      .then(response => {
        setProduct(response.data);  // Almacenar los detalles del producto en el estado
      })
      .catch(error => {
        console.error("Error al obtener los detalles del producto:", error);
      });
  }, [id]);  // Dependemos de `id` para hacer la solicitud cuando cambia

  if (!product) {
    return <Typography variant="h6" sx={{ textAlign: 'center' }}>Cargando producto...</Typography>;
  }

  // Asegúrate de que 'product.url' esté definido (la URL de la imagen)
  const imageUrl = product.url;

  // Opciones de colores
  const colorOptions = [
    { name: 'Azul', colorCode: '#0000FF' },
    { name: 'Rosa', colorCode: '#FF1493' },
    { name: 'Rojo', colorCode: '#FF0000' },
    { name: 'Verde', colorCode: '#00FF00' },
    { name: 'Blanco', colorCode: '#FFFFFF' },
    { name: 'Negro', colorCode: '#000000' },
  ];

  const handleAddToCart = () => {
    console.log('Producto agregado al carrito:', { product, selectedSize, selectedColor, selectedQuantity });
  };

  return (
    <Box padding={3} sx={{ backgroundColor: '#f9f9f9' }}>
      <Grid container spacing={4} alignItems="center">
        {/* Imagen del producto a la izquierda */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src={imageUrl} 
            alt={product.nombre_producto} 
            style={{
              width: '70%', 
              maxWidth: '400px', 
              height: 'auto', 
              display: 'block', 
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }} 
          />
        </Grid>

        {/* Información del producto al lado derecho */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', marginBottom: '16px' }}>
            {product.nombre_producto}
          </Typography>

          {/* Descripción del producto */}
          <Typography variant="body2" sx={{ color: 'black', marginBottom: '20px' }}>
            {product.descripcion}
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

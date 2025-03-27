import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Divider, Button, IconButton, Chip, Container, Paper, Rating, Stack, alpha, Skeleton, Alert, Snackbar } from '@mui/material';
import { Add, Remove, ShoppingCart, ArrowBack, CheckCircle, Payment } from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../Autenticacion/AuthContext';

const DetallesProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const customColors = {
    primary: '#3a36e0',
    secondary: '#6e62e5',
    accent: '#8857e0',
    lightAccent: '#b253d8',
    rose: '#e252b2',
    background: '#f8f9ff',
    cardBg: '#ffffff',
    textPrimary: '#2c2c54',
    textSecondary: '#4b4b80',
    buttonBlue: '#4682b4',
    gradient: 'linear-gradient(135deg, #3a36e0 0%, #b253d8 100%)'
  };

     const { user } = useAuth();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/producto-detalle/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles del producto:", error);
        setError("No pudimos cargar los detalles del producto. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const colorOptions = [
    { name: 'Azul', colorCode: '#3a36e0' },
    { name: 'Rosa', colorCode: '#e252b2' },
    { name: 'Rojo', colorCode: '#e74c3c' },
    { name: 'Verde', colorCode: '#2ecc71' },
    { name: 'Blanco', colorCode: '#ffffff' },
    { name: 'Negro', colorCode: '#2c2c54' },
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSnackbarMessage('Por favor selecciona una talla');
      setSnackbarOpen(true);
      return;
    }

    if (!selectedColor) {
      setSnackbarMessage('Por favor selecciona un color');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/agregarcarrito", {
        usuario_id: user?.id, // Aquí debes tomar el ID del usuario desde tu estado o contexto
        producto_id: product.id,
        cantidad: selectedQuantity
      });

      setSnackbarMessage(response.data.mensaje || 'Producto agregado al carrito');
      setSnackbarOpen(true);

      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      setSnackbarMessage(error.response?.data?.error || 'Error al agregar el producto al carrito');
      setSnackbarOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      setSnackbarMessage('Por favor selecciona talla y color');
      setSnackbarOpen(true);
      return;
    }
    console.log('Compra iniciada:', { product, selectedSize, selectedColor, selectedQuantity });
    navigate('/checkout');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleBackToProducts = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Paper elevation={2} sx={{ p: 3, borderRadius: '16px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: '16px' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={50} />
              <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="rectangular" height={40} width="70%" sx={{ mt: 2, borderRadius: '12px' }} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', backgroundColor: alpha('#f44336', 0.1) }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={handleBackToProducts}
          startIcon={<ArrowBack />}
          sx={{ 
            borderRadius: '12px',
            backgroundColor: customColors.buttonBlue,
            '&:hover': { backgroundColor: alpha(customColors.buttonBlue, 0.8) }
          }}
        >
          Volver a productos
        </Button>
      </Container>
    );
  }

  if (!product) return null;

  const imageUrl = product.url || '/placeholder-image.jpg';

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper elevation={2} sx={{ borderRadius: '16px', backgroundColor: customColors.cardBg }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: alpha(customColors.background, 0.5),
              p: 3
            }}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt={product.nombre_producto}
                  sx={{
                    width: '100%',
                    maxWidth: '350px',
                    height: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.08)'
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6} sx={{ p: 3 }}>
              <Box sx={{ mb: 1 }}>
                <Button 
                  onClick={handleBackToProducts} 
                  startIcon={<ArrowBack />}
                  sx={{ color: customColors.textSecondary, '&:hover': { color: customColors.accent } }}
                >
                  Volver
                </Button>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 700, color: customColors.textPrimary, mb: 1 }}>
                {product.nombre_producto}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly sx={{ color: customColors.accent }} />
                <Typography variant="body2" sx={{ ml: 1, color: customColors.textSecondary }}>
                  (24 reseñas)
                </Typography>
              </Box>

              <Typography variant="h5" sx={{ 
                mb: 2, 
                fontWeight: 700,
                color: customColors.buttonBlue
              }}>
                ${parseFloat(product.precio || '0').toFixed(2)}
              </Typography>

              <Typography variant="body1" sx={{ color: customColors.textSecondary, mb: 2 }}>
                {product.descripcion}
              </Typography>

              <Divider sx={{ mb: 2, backgroundColor: alpha(customColors.textPrimary, 0.1) }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                  Talla
                </Typography>
                <Stack direction="row" spacing={1}>
                  {sizeOptions.map((size) => (
                    <Chip
                      key={size}
                      label={size}
                      onClick={() => setSelectedSize(size)}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: selectedSize === size 
                          ? `2px solid ${customColors.accent}` 
                          : `1px solid ${alpha(customColors.textPrimary, 0.2)}`,
                        backgroundColor: selectedSize === size ? alpha(customColors.accent, 0.1) : 'transparent',
                        color: selectedSize === size ? customColors.accent : customColors.textPrimary,
                        '&:hover': { backgroundColor: alpha(customColors.accent, 0.2) }
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                  Color
                </Typography>
                <Stack direction="row" spacing={1}>
                  {colorOptions.map((color) => (
                    <IconButton
                      key={color.name}
                      sx={{
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        backgroundColor: color.colorCode,
                        boxShadow: selectedColor === color.colorCode ? `0 0 8px 2px ${color.colorCode}` : 'none',
                        '&:hover': {
                          boxShadow: `0 0 10px 4px ${color.colorCode}`,
                        }
                      }}
                      onClick={() => setSelectedColor(color.colorCode)}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: customColors.textPrimary, mr: 2 }}>
                  Cantidad
                </Typography>
                <IconButton onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))} sx={{ color: customColors.textPrimary }}>
                  <Remove />
                </IconButton>
                <Typography variant="h6" sx={{ color: customColors.textPrimary }}>
                  {selectedQuantity}
                </Typography>
                <IconButton onClick={() => setSelectedQuantity(selectedQuantity + 1)} sx={{ color: customColors.textPrimary }}>
                  <Add />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                onClick={handleAddToCart}
                fullWidth
                startIcon={<ShoppingCart />}
                sx={{
                  mb: 2,
                  backgroundColor: customColors.gradient,
                  '&:hover': {
                    backgroundColor: customColors.secondary
                  }
                }}
              >
                Agregar al carrito
              </Button>

              <Button
                variant="contained"
                onClick={handleBuyNow}
                fullWidth
                color="primary"
                startIcon={<Payment />}
                sx={{
                  backgroundColor: customColors.primary,
                  '&:hover': {
                    backgroundColor: customColors.secondary
                  }
                }}
              >
                Comprar ahora
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CheckCircle />
          </IconButton>
        }
      />
    </Container>
  );
};

export default DetallesProducto;

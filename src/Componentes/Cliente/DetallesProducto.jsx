import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Divider, Button, IconButton, Chip, Container,Paper,Rating,Stack,alpha,Skeleton,Alert,Snackbar} from '@mui/material';
import { Add, Remove, ShoppingCart,ArrowBack,CheckCircle,LocalShipping,VerifiedUser,Payment} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';

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
    buttonBlue: '#4682b4', // Nuevo color azul bajo para los botones
    gradient: 'linear-gradient(135deg, #3a36e0 0%, #b253d8 100%)'
  };

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

  const handleAddToCart = () => {
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
    
    setSnackbarMessage('Producto agregado al carrito correctamente');
    setSnackbarOpen(true);
    console.log('Producto agregado al carrito:', { product, selectedSize, selectedColor, selectedQuantity });
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
                        '&:hover': { backgroundColor: alpha(customColors.accent, 0.05) }
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
                  {colorOptions.map(({ name, colorCode }) => (
                    <IconButton
                      key={name}
                      onClick={() => setSelectedColor(name)}
                      sx={{
                        borderRadius: '12px',
                        width: 40,
                        height: 40,
                        backgroundColor: colorCode,
                        border: selectedColor === name 
                          ? `2px solid ${customColors.accent}` 
                          : `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                        boxShadow: name === 'Blanco' ? '0px 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                  Cantidad
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  border: `1px solid ${alpha(customColors.textPrimary, 0.2)}`,
                  borderRadius: '8px',
                  width: 'fit-content'
                }}>
                  <IconButton 
                    onClick={() => setSelectedQuantity(selectedQuantity > 1 ? selectedQuantity - 1 : 1)}
                    sx={{ color: customColors.textPrimary }}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>
                    {selectedQuantity}
                  </Typography>
                  <IconButton 
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    sx={{ color: customColors.textPrimary }}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{
                      py: 1,
                      borderRadius: '12px',
                      fontWeight: 600,
                      backgroundColor: customColors.buttonBlue,
                      '&:hover': { backgroundColor: alpha(customColors.buttonBlue, 0.8) }
                    }}
                    onClick={handleAddToCart}
                    startIcon={<ShoppingCart />}
                  >
                    Agregar al carrito
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{
                      py: 1,
                      borderRadius: '12px',
                      fontWeight: 600,
                      backgroundColor: customColors.buttonBlue,
                      '&:hover': { backgroundColor: alpha(customColors.buttonBlue, 0.8) }
                    }}
                    onClick={handleBuyNow}
                    startIcon={<Payment />}
                  >
                    Comprar ahora
                  </Button>
                </Grid>
              </Grid>

              <Stack direction="column" spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: alpha(customColors.background, 0.5), borderRadius: '8px' }}>
                  <LocalShipping sx={{ color: customColors.accent, mr: 1, fontSize: 24 }} />
                  <Typography variant="body2" sx={{ color: customColors.textPrimary }}>
                    Envío gratuito en pedidos superiores a $50
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: alpha(customColors.background, 0.5), borderRadius: '8px' }}>
                  <CheckCircle sx={{ color: customColors.accent, mr: 1, fontSize: 24 }} />
                  <Typography variant="body2" sx={{ color: customColors.textPrimary }}>
                    Disponible para entrega inmediata
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: alpha(customColors.background, 0.5), borderRadius: '8px' }}>
                  <VerifiedUser sx={{ color: customColors.accent, mr: 1, fontSize: 24 }} />
                  <Typography variant="body2" sx={{ color: customColors.textPrimary }}>
                    Garantía de calidad
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: '16px', backgroundColor: customColors.cardBg }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: customColors.textPrimary }}>
                Características del producto
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: customColors.textSecondary, lineHeight: 1.5 }}>
                GisLive Boutique Clínica presenta una línea de uniformes médicos diseñados con los más altos estándares de calidad y comodidad. Nuestros productos están fabricados con materiales premium que garantizan durabilidad y resistencia durante largas jornadas laborales. La tela antimicrobiana y antifluidos ofrece protección adicional en entornos clínicos, mientras que su diseño ergonómico permite libertad de movimiento.
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: customColors.textPrimary }}>Material</Typography>
                  <Typography variant="body2" sx={{ color: customColors.textSecondary }}>65% Poliéster, 35% Algodón</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: customColors.textPrimary }}>Cuidados</Typography>
                  <Typography variant="body2" sx={{ color: customColors.textSecondary }}>Lavado a máquina, temperatura media</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: customColors.textPrimary }}>Características</Typography>
                  <Typography variant="body2" sx={{ color: customColors.textSecondary }}>Antimicrobiano, Antifluidos</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: customColors.textPrimary }}>Bolsillos</Typography>
                  <Typography variant="body2" sx={{ color: customColors.textSecondary }}>Múltiples bolsillos funcionales</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: '16px', backgroundColor: customColors.cardBg }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: customColors.textPrimary }}>
                Guía de tallas
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: customColors.textSecondary }}>
                Consulta nuestra tabla de tallas para el ajuste perfecto:
              </Typography>
              <Box>
                <Grid container sx={{ fontWeight: 600, color: customColors.textPrimary, borderBottom: `1px solid ${alpha(customColors.textPrimary, 0.1)}`, pb: 1 }}>
                  <Grid item xs={3}>Talla</Grid>
                  <Grid item xs={3}>Pecho</Grid>
                  <Grid item xs={3}>Cintura</Grid>
                  <Grid item xs={3}>Cadera</Grid>
                </Grid>
                {[
                  { size: 'XS', chest: '82-86', waist: '65-69', hip: '90-94' },
                  { size: 'S', chest: '86-90', waist: '69-73', hip: '94-98' },
                  { size: 'M', chest: '90-94', waist: '73-77', hip: '98-102' },
                  { size: 'L', chest: '94-98', waist: '77-81', hip: '102-106' },
                  { size: 'XL', chest: '98-102', waist: '81-85', hip: '106-110' }
                ].map((row) => (
                  <Grid container key={row.size} sx={{ py: 0.5, color: customColors.textSecondary }}>
                    <Grid item xs={3} sx={{ fontWeight: selectedSize === row.size ? 600 : 400 }}>{row.size}</Grid>
                    <Grid item xs={3}>{row.chest}</Grid>
                    <Grid item xs={3}>{row.waist}</Grid>
                    <Grid item xs={3}>{row.hip}</Grid>
                  </Grid>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: customColors.accent,
            color: 'white',
            borderRadius: '12px'
          }
        }}
      />
    </Container>
  );
};

export default DetallesProducto;

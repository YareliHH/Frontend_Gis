import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Divider, 
  Button, 
  IconButton, 
  Chip, 
  Container,
  Paper,
  Rating,
  Stack,
  alpha,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
  Snackbar
} from '@mui/material';
import { 
  Add, 
  Remove, 
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  CheckCircle,
  Share,
  LocalShipping,
  VerifiedUser,
  NavigateNext
} from '@mui/icons-material';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Definir la paleta de colores personalizada (igual que en el componente principal)
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
    gradient: 'linear-gradient(135deg, #3a36e0 0%, #b253d8 100%)'
  };

  // Obtener los detalles del producto cuando se carga el componente
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

  // Opciones de colores
  const colorOptions = [
    { name: 'Azul', colorCode: '#3a36e0' },
    { name: 'Rosa', colorCode: '#e252b2' },
    { name: 'Rojo', colorCode: '#e74c3c' },
    { name: 'Verde', colorCode: '#2ecc71' },
    { name: 'Blanco', colorCode: '#ffffff' },
    { name: 'Negro', colorCode: '#2c2c54' },
  ];

  // Opciones de tallas
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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setSnackbarMessage(isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleBackToProducts = () => {
    navigate(-1);
  };

  // Renderizado de carga
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
        </Box>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" height={25} sx={{ mt: 2 }} />
              <Skeleton variant="text" height={25} />
              <Skeleton variant="text" height={25} width="60%" />
              <Divider sx={{ my: 3 }} />
              <Skeleton variant="text" height={30} width={100} />
              <Box sx={{ display: 'flex', mt: 2, mb: 3 }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton key={item} variant="circular" width={40} height={40} sx={{ mr: 1 }} />
                ))}
              </Box>
              <Skeleton variant="text" height={30} width={100} />
              <Box sx={{ display: 'flex', mt: 2, mb: 3 }}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton key={item} variant="circular" width={40} height={40} sx={{ mr: 1 }} />
                ))}
              </Box>
              <Skeleton variant="rectangular" height={50} width="80%" sx={{ mt: 3, borderRadius: '12px' }} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  // Renderizado de error
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: '12px',
            backgroundColor: alpha('#f44336', 0.1),
            '& .MuiAlert-icon': {
              color: '#f44336'
            }
          }}
        >
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={handleBackToProducts}
          startIcon={<ArrowBack />}
          sx={{ 
            borderRadius: '12px',
            textTransform: 'none',
            background: customColors.gradient,
            px: 3,
            py: 1.2,
            boxShadow: `0 4px 10px ${alpha(customColors.primary, 0.3)}`,
            '&:hover': {
              boxShadow: `0 6px 15px ${alpha(customColors.primary, 0.4)}`
            }
          }}
        >
          Volver a productos
        </Button>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  // Asegúrate de que 'product.url' esté definido (la URL de la imagen)
  const imageUrl = product.url || '/placeholder-image.jpg';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" sx={{ color: customColors.textSecondary }} />}
          aria-label="breadcrumb"
        >
          <Link 
            color="inherit" 
            href="/" 
            sx={{ 
              textDecoration: 'none', 
              color: customColors.textSecondary,
              '&:hover': { color: customColors.accent }
            }}
          >
            Inicio
          </Link>
          <Link 
            color="inherit" 
            href="/uniformes" 
            sx={{ 
              textDecoration: 'none', 
              color: customColors.textSecondary,
              '&:hover': { color: customColors.accent }
            }}
          >
            Uniformes
          </Link>
          <Typography sx={{ color: customColors.accent }}>
            {product.nombre_producto}
          </Typography>
        </Breadcrumbs>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: customColors.cardBg
          }}
        >
          <Grid container>
            {/* Imagen del producto a la izquierda */}
            <Grid item xs={12} md={6} sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: alpha(customColors.background, 0.5),
              p: { xs: 3, md: 6 }
            }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={product.nombre_producto}
                  sx={{
                    width: '100%',
                    maxWidth: '400px',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                />
              </motion.div>
            </Grid>

            {/* Información del producto al lado derecho */}
            <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Button 
                  onClick={handleBackToProducts} 
                  startIcon={<ArrowBack />}
                  sx={{ 
                    minWidth: 'auto',
                    color: customColors.textSecondary,
                    '&:hover': { color: customColors.accent }
                  }}
                >
                  Volver
                </Button>
                <IconButton 
                  onClick={toggleFavorite}
                  sx={{ 
                    color: isFavorite ? customColors.rose : customColors.textSecondary,
                    '&:hover': { 
                      backgroundColor: alpha(customColors.rose, 0.1) 
                    }
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: customColors.textPrimary, 
                  mb: 2,
                  lineHeight: 1.2
                }}
              >
                {product.nombre_producto}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={4.5} precision={0.5} readOnly sx={{ 
                  color: customColors.accent,
                  '& .MuiRating-iconEmpty': {
                    color: alpha(customColors.accent, 0.3)
                  }
                }} />
                <Typography variant="body2" sx={{ ml: 1, color: customColors.textSecondary }}>
                  (24 reseñas)
                </Typography>
              </Box>

              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 700,
                  background: customColors.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                ${parseFloat(product.precio || '0').toFixed(2)}
              </Typography>

              {/* Descripción del producto */}
              <Typography 
                variant="body1" 
                sx={{ 
                  color: customColors.textSecondary, 
                  mb: 3,
                  lineHeight: 1.6
                }}
              >
                {product.descripcion}
              </Typography>
              
              <Divider sx={{ 
                mb: 3, 
                backgroundColor: alpha(customColors.textPrimary, 0.1) 
              }} />

              {/* Filtro de talla */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: customColors.textPrimary, 
                    mb: 1.5 
                  }}
                >
                  Talla
                </Typography>
                <Stack direction="row" spacing={1}>
                  {sizeOptions.map((size) => (
                    <motion.div
                      key={size}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        label={size}
                        onClick={() => setSelectedSize(size)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          padding: '20px 10px',
                          height: 'auto',
                          fontWeight: 600,
                          border: selectedSize === size 
                            ? `2px solid ${customColors.accent}` 
                            : `1px solid ${alpha(customColors.textPrimary, 0.2)}`,
                          backgroundColor: selectedSize === size ? alpha(customColors.accent, 0.1) : 'transparent',
                          color: selectedSize === size ? customColors.accent : customColors.textPrimary,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: alpha(customColors.accent, 0.05)
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </Box>

              {/* Filtro de color */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: customColors.textPrimary, 
                    mb: 1.5 
                  }}
                >
                  Color
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  {colorOptions.map(({ name, colorCode }) => (
                    <motion.div
                      key={name}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        onClick={() => setSelectedColor(name)}
                        aria-label={`Color ${name}`}
                        sx={{
                          borderRadius: '12px',
                          width: 45,
                          height: 45,
                          backgroundColor: colorCode,
                          border: selectedColor === name 
                            ? `3px solid ${customColors.accent}` 
                            : `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                          boxShadow: name === 'Blanco' 
                            ? '0px 2px 8px rgba(0, 0, 0, 0.1)' 
                            : 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            transform: 'scale(1.1)',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                          },
                          '&::after': selectedColor === name ? {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            opacity: 0.3
                          } : {}
                        }}
                      />
                      {selectedColor === name && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block', 
                            textAlign: 'center', 
                            mt: 0.5,
                            color: customColors.accent,
                            fontWeight: 500
                          }}
                        >
                          {name}
                        </Typography>
                      )}
                    </motion.div>
                  ))}
                </Stack>
              </Box>

              {/* Filtro de cantidad */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600, 
                    color: customColors.textPrimary, 
                    mb: 1.5 
                  }}
                >
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
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      width: '40px', 
                      textAlign: 'center', 
                      fontWeight: 600,
                      color: customColors.textPrimary
                    }}
                  >
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

              <Divider sx={{ 
                mb: 3, 
                backgroundColor: alpha(customColors.textPrimary, 0.1) 
              }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  {/* Botón de agregar al carrito */}
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: customColors.gradient,
                      boxShadow: `0 4px 10px ${alpha(customColors.primary, 0.3)}`,
                      '&:hover': {
                        boxShadow: `0 6px 15px ${alpha(customColors.primary, 0.4)}`
                      }
                    }}
                    onClick={handleAddToCart}
                    startIcon={<ShoppingCart sx={{ mr: 0.5 }} />}
                  >
                    Agregar al carrito
                  </Button>
                </Grid>
              </Grid>

              {/* Información adicional */}
              <Stack direction="column" spacing={2} sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ color: customColors.accent, mr: 1.5 }} />
                  <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                    Envío gratuito en pedidos superiores a $50
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ color: customColors.accent, mr: 1.5 }} />
                  <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                    Disponible para entrega inmediata
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VerifiedUser sx={{ color: customColors.accent, mr: 1.5 }} />
                  <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                    Garantía de calidad
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Información detallada del producto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: '16px',
                height: '100%',
                backgroundColor: customColors.cardBg
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  color: customColors.textPrimary
                }}
              >
                Características del producto
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 2,
                    color: customColors.textSecondary,
                    lineHeight: 1.7
                  }}
                >
                  GisLive Boutique Clínica presenta una línea de uniformes médicos diseñados con los más altos estándares de calidad y comodidad. Nuestros productos están fabricados con materiales premium que garantizan durabilidad y resistencia durante largas jornadas laborales.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: customColors.textSecondary,
                    lineHeight: 1.7
                  }}
                >
                  La tela antimicrobiana y antifluidos ofrece protección adicional en entornos clínicos, mientras que su diseño ergonómico permite libertad de movimiento y comodidad durante todo el día.
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: customColors.textPrimary }}>
                      Material (lo puedes quitar)
                    </Typography>
                    <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                      65% Poliéster, 35% Algodón
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: customColors.textPrimary }}>
                      Cuidados (lo puedes quitar)
                    </Typography>
                    <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                      Lavado a máquina, temperatura media
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: customColors.textPrimary }}>
                      Características (lo puedes quitar)
                    </Typography>
                    <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                      Antimicrobiano, Antifluidos, Transpirable
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: customColors.textPrimary }}>
                      Bolsillos (lo puedes quitar)
                    </Typography>
                    <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                      Múltiples bolsillos funcionales
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: '16px',
                height: '100%',
                backgroundColor: customColors.cardBg
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  color: customColors.textPrimary
                }}
              >
                Guía de tallas
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 3,
                  color: customColors.textSecondary
                }}
              >
                Para garantizar el ajuste perfecto, te recomendamos tomar tus medidas y consultar nuestra tabla de tallas:
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container sx={{ 
                  mb: 1,
                  pb: 1,
                  borderBottom: `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                  fontWeight: 600,
                  color: customColors.textPrimary
                }}>
                  <Grid item xs={3}>Talla</Grid>
                  <Grid item xs={3}>Pecho (cm)</Grid>
                  <Grid item xs={3}>Cintura (cm)</Grid>
                  <Grid item xs={3}>Cadera (cm)</Grid>
                </Grid>
                {[
                  { size: 'XS', chest: '82-86', waist: '65-69', hip: '90-94' },
                  { size: 'S', chest: '86-90', waist: '69-73', hip: '94-98' },
                  { size: 'M', chest: '90-94', waist: '73-77', hip: '98-102' },
                  { size: 'L', chest: '94-98', waist: '77-81', hip: '102-106' },
                  { size: 'XL', chest: '98-102', waist: '81-85', hip: '106-110' }
                ].map((row) => (
                  <Grid 
                    container 
                    key={row.size} 
                    sx={{ 
                      py: 1,
                      color: customColors.textSecondary,
                      borderBottom: `1px solid ${alpha(customColors.textPrimary, 0.05)}`,
                      '&:hover': {
                        backgroundColor: alpha(customColors.accent, 0.03)
                      }
                    }}
                  >
                    <Grid item xs={3} sx={{ fontWeight: selectedSize === row.size ? 600 : 400, color: selectedSize === row.size ? customColors.accent : 'inherit' }}>
                      {row.size}
                    </Grid>
                    <Grid item xs={3}>{row.chest}</Grid>
                    <Grid item xs={3}>{row.waist}</Grid>
                    <Grid item xs={3}>{row.hip}</Grid>
                  </Grid>
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: customColors.textSecondary, fontStyle: 'italic', mt: 2 }}>
                * Las medidas pueden variar ligeramente según el modelo.
              </Typography>
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
            borderRadius: '12px',
            fontWeight: 500
          }
        }}
      />
    </Container>
  );
};

export default DetallesProducto;
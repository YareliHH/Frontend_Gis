import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Divider, Button, IconButton, Chip, Container,
  Paper, Rating, Stack, alpha, Skeleton, Alert, Snackbar, Tabs, Tab,
  Dialog, DialogContent, Backdrop
} from '@mui/material';
import { 
  Add, Remove, ShoppingCart, ArrowBack, CheckCircle, LocalShipping,
  VerifiedUser, Payment, FavoriteBorder, Share, ChevronLeft, ChevronRight,
  ZoomIn, Close
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';

const DetallesProducto = () => {
  // Referencias para zoom
  const zoomContainerRef = useRef(null);
  const zoomResultRef = useRef(null);
  const zoomLensRef = useRef(null);
  const imgRef = useRef(null);
  
  // Temporizador para ocultar el zoom
  const hideZoomTimer = useRef(null);

  // Estados para manejo de productos
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

  // Estados para galería y zoom
  const [productImages, setProductImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [zoomLevel, setZoomLevel] = useState(3); // Nivel de zoom aumentado

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
    mercadoYellow: '#fff159',
    mercadoBlue: '#2968c8',
    white: '#ffffff',
    black: '#000000',
    gradient: 'linear-gradient(135deg, #3a36e0 0%, #b253d8 100%)'
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/producto-detalle/${id}`);
        
        // Configurar el producto
        setProduct(response.data);
        
        // Usar las imágenes del API - ahora con la estructura actualizada
        if (response.data.imagenes && response.data.imagenes.length > 0) {
          setProductImages(response.data.imagenes);
        } else if (response.data.url) {
          // Compatibilidad con versión anterior (si solo viene url)
          setProductImages([{ id: 1, url: response.data.url }]);
        } else {
          // Si no hay imágenes, usar una imagen por defecto
          setProductImages([{ id: 1, url: '/placeholder-image.jpg' }]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles del producto:", error);
        setError("No pudimos cargar los detalles del producto. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  useEffect(() => {
    // Inicializar los estilos de zoom cuando cambia la imagen seleccionada
    if (zoomResultRef.current && productImages.length > 0) {
      zoomResultRef.current.style.backgroundImage = `url(${productImages[selectedImageIndex]?.url})`;
    }
  }, [selectedImageIndex, productImages]);

  // Función de zoom mejorada con cálculos más precisos
  const handleMouseMove = (e) => {
    if (!imgRef.current || !zoomLensRef.current || !zoomResultRef.current) return;
    
    // Prevenir comportamiento predeterminado
    e.preventDefault();
    
    setZoomVisible(true);
    
    // Obtener posiciones y tamaños
    const img = imgRef.current;
    const lens = zoomLensRef.current;
    const result = zoomResultRef.current;
    
    // Obtener posición de la imagen
    const imgRect = img.getBoundingClientRect();
    
    // Calcular ratios
    const ratio = 3; // Nivel de zoom
    
    // Obtener posición del cursor relativa a la ventana
    let x = e.clientX - imgRect.left;
    let y = e.clientY - imgRect.top;
    
    // No permitir que la lente salga de la imagen
    const lensWidth = lens.offsetWidth;
    const lensHeight = lens.offsetHeight;
    
    if (x < lensWidth / 2) x = lensWidth / 2;
    if (y < lensHeight / 2) y = lensHeight / 2;
    if (x > imgRect.width - lensWidth / 2) x = imgRect.width - lensWidth / 2;
    if (y > imgRect.height - lensHeight / 2) y = imgRect.height - lensHeight / 2;
    
    // Posicionar la lente centrada en el cursor
    lens.style.left = (x - lensWidth / 2) + "px";
    lens.style.top = (y - lensHeight / 2) + "px";
    
    // Calcular posición de fondo para el resultado
    const resultWidth = result.offsetWidth;
    const resultHeight = result.offsetHeight;
    
    // Calcular la posición de la imagen ampliada en el resultado
    const backgroundPosX = ((x - lensWidth / 2) * ratio);
    const backgroundPosY = ((y - lensHeight / 2) * ratio);
    
    // Actualizar la imagen de resultado
    result.style.backgroundImage = `url(${productImages[selectedImageIndex]?.url})`;
    result.style.backgroundSize = `${imgRect.width * ratio}px ${imgRect.height * ratio}px`;
    result.style.backgroundPosition = `-${backgroundPosX}px -${backgroundPosY}px`;
  };

  const colorOptions = [
    { name: 'Azul', colorCode: '#3a36e0' },
    { name: 'Rosa', colorCode: '#e252b2' },
    { name: 'Rojo', colorCode: '#e74c3c' },
    { name: 'Verde', colorCode: '#2ecc71' },
    { name: 'Blanco', colorCode: customColors.white },
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

  const handleChangeImage = (index) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleOpenZoom = () => {
    setZoomOpen(true);
  };

  const handleCloseZoom = () => {
    setZoomOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={200} height={40} />
        </Box>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
              <Box sx={{ display: 'flex', mt: 2, justifyContent: 'center' }}>
                {[1, 2, 3, 4].map(item => (
                  <Skeleton 
                    key={item} 
                    variant="rectangular" 
                    width={70} 
                    height={70} 
                    sx={{ borderRadius: '8px', mx: 0.5 }} 
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={50} />
              <Skeleton variant="text" width="70%" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={60} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="90%" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="90%" height={30} />
              <Skeleton variant="rectangular" height={60} width="100%" sx={{ mt: 3, borderRadius: '12px' }} />
              <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
                <Skeleton variant="rectangular" height={50} width="48%" sx={{ borderRadius: '12px' }} />
                <Skeleton variant="rectangular" height={50} width="48%" sx={{ borderRadius: '12px' }} />
              </Box>
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
            backgroundColor: customColors.mercadoBlue,
            '&:hover': { backgroundColor: alpha(customColors.mercadoBlue, 0.8) }
          }}
        >
          Volver a productos
        </Button>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 1 }}>
        <Button 
          onClick={handleBackToProducts} 
          startIcon={<ArrowBack />}
          sx={{ color: customColors.textSecondary, '&:hover': { color: customColors.mercadoBlue } }}
        >
          Volver
        </Button>
      </Box>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Paper elevation={0} sx={{ borderRadius: '16px', backgroundColor: customColors.cardBg, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <Grid container spacing={0}>
            {/* Sección de imágenes */}
            <Grid item xs={12} md={6} sx={{ p: { xs: 2, md: 3 }, position: 'relative' }}>
              <Box sx={{ position: 'relative' }}>
                {/* Contenedor de imagen con zoom */}
                <Box 
                  ref={zoomContainerRef}
                  sx={{ 
                    width: '100%',
                    height: { xs: '300px', sm: '400px' },
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'visible', // Cambiado a visible para permitir que el zoom se vea fuera del contenedor
                    cursor: 'crosshair',
                    border: `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: customColors.white
                  }}
                >
                  {/* Imagen principal */}
                  <Box 
                    component="img"
                    ref={imgRef}
                    src={productImages[selectedImageIndex]?.url}
                    alt={product.nombre_producto}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => {
                      if (hideZoomTimer.current) {
                        clearTimeout(hideZoomTimer.current);
                      }
                      setZoomVisible(true);
                    }}
                    onMouseLeave={() => {
                      hideZoomTimer.current = setTimeout(() => {
                        setZoomVisible(false);
                      }, 100);
                    }}
                    onClick={handleOpenZoom}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      position: 'relative'
                    }}
                  />
                  
                  {/* Lente de zoom (cuadro azul) */}
                  {zoomVisible && (
                    <Box
                      ref={zoomLensRef}
                      sx={{
                        position: 'absolute',
                        width: '80px',
                        height: '80px',
                        cursor: 'crosshair',
                        pointerEvents: 'none',
                        zIndex: 10
                      }}
                    />
                  )}
                  
                  {/* Resultado del zoom */}
                  {zoomVisible && (
                    <Box
                      ref={zoomResultRef}
                      sx={{
                        position: 'absolute',
                        right: '-320px',
                        top: '0',
                        width: '300px',
                        height: '300px',
                        border: '1px solid #ddd',
                        backgroundRepeat: 'no-repeat',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    />
                  )}
                  
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      right: 10, 
                      top: 10, 
                      backgroundColor: alpha(customColors.white, 0.8),
                      '&:hover': { backgroundColor: customColors.white },
                      zIndex: 5
                    }}
                    onClick={handleOpenZoom}
                  >
                    <ZoomIn />
                  </IconButton>
                </Box>

                {/* Controles de navegación - solo se muestran si hay más de una imagen */}
                {productImages.length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: alpha(customColors.white, 0.8),
                        '&:hover': { backgroundColor: customColors.white }
                      }}
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: alpha(customColors.white, 0.8),
                        '&:hover': { backgroundColor: customColors.white }
                      }}
                      onClick={handleNextImage}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* Miniaturas de imágenes - solo se muestran si hay más de una imagen */}
              {productImages.length > 1 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 2,
                    gap: 1,
                    flexWrap: 'wrap'
                  }}
                >
                  {productImages.map((image, index) => (
                    <Box
                      key={image.id}
                      onClick={() => handleChangeImage(index)}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '8px',
                        border: index === selectedImageIndex 
                          ? `2px solid ${customColors.mercadoBlue}` 
                          : `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: customColors.white
                      }}
                    >
                      <Box
                        component="img"
                        src={image.url}
                        alt={`${product.nombre_producto} - Imagen ${index + 1}`}
                        sx={{
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Botones de acción social */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                <Button 
                  startIcon={<FavoriteBorder />} 
                  sx={{ 
                    color: customColors.textSecondary,
                    '&:hover': { color: customColors.mercadoBlue }
                  }}
                >
                  Favorito
                </Button>
                <Button 
                  startIcon={<Share />} 
                  sx={{ 
                    color: customColors.textSecondary,
                    '&:hover': { color: customColors.mercadoBlue }
                  }}
                >
                  Compartir
                </Button>
              </Box>
            </Grid>

            {/* Información del producto */}
            <Grid item xs={12} md={6} sx={{ p: { xs: 2, md: 3 }, backgroundColor: alpha(customColors.background, 0.3) }}>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  backgroundColor: alpha(customColors.mercadoBlue, 0.1), 
                  color: customColors.mercadoBlue,
                  px: 1, 
                  py: 0.5, 
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  mr: 1
                }}>
                  NUEVO
                </Box>
                <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                  {product.stock > 10 ? 'En stock' : `¡Solo quedan ${product.stock} unidades!`}
                </Typography>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 700, color: customColors.textPrimary, mb: 1 }}>
                {product.nombre_producto}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly sx={{ color: customColors.mercadoBlue }} />
                <Typography variant="body2" sx={{ ml: 1, color: customColors.textSecondary }}>
                  (24 reseñas)
                </Typography>
              </Box>

              <Typography variant="h4" sx={{ 
                mb: 1, 
                fontWeight: 700,
                color: customColors.mercadoBlue
              }}>
                ${parseFloat(product.precio || '0').toFixed(2)}
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: customColors.accent, 
                mb: 2,
                fontWeight: 500
              }}>
                12 cuotas sin interés de ${(parseFloat(product.precio || '0') / 12).toFixed(2)}
              </Typography>

              <Typography variant="body1" sx={{ color: customColors.textSecondary, mb: 2 }}>
                {product.descripcion}
              </Typography>

              <Divider sx={{ mb: 2, backgroundColor: alpha(customColors.textPrimary, 0.1) }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                  Talla
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
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
                          ? `2px solid ${customColors.mercadoBlue}` 
                          : `1px solid ${alpha(customColors.textPrimary, 0.2)}`,
                        backgroundColor: selectedSize === size ? alpha(customColors.mercadoBlue, 0.1) : 'transparent',
                        color: selectedSize === size ? customColors.mercadoBlue : customColors.textPrimary,
                        '&:hover': { backgroundColor: alpha(customColors.mercadoBlue, 0.05) },
                        mb: 1
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                  Color
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
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
                          ? `2px solid ${customColors.mercadoBlue}` 
                          : `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                        boxShadow: name === 'Blanco' ? '0px 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                        '&:hover': { transform: 'scale(1.1)' },
                        mb: 1
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mb: 3 }}>
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

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: '4px',
                      fontWeight: 600,
                      backgroundColor: customColors.mercadoBlue,
                      '&:hover': { backgroundColor: alpha(customColors.mercadoBlue, 0.9) },
                      boxShadow: 'none',
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                    onClick={handleBuyNow}
                    startIcon={<Payment />}
                  >
                    Comprar ahora
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: '4px',
                      fontWeight: 600,
                      backgroundColor: alpha(customColors.mercadoBlue, 0.1),
                      color: customColors.mercadoBlue,
                      '&:hover': { backgroundColor: alpha(customColors.mercadoBlue, 0.2) },
                      boxShadow: 'none',
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                    onClick={handleAddToCart}
                    startIcon={<ShoppingCart />}
                  >
                    Agregar al carrito
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ 
                p: 2, 
                borderRadius: '8px', 
                backgroundColor: alpha(customColors.mercadoYellow, 0.2),
                mb: 2
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1, display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ mr: 1, color: customColors.mercadoBlue, fontSize: 20 }} />
                  Envío gratis a todo el país
                </Typography>
                <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                  Conoce los tiempos y las formas de envío.
                </Typography>
              </Box>

              <Stack direction="column" spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ color: customColors.mercadoBlue, mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: customColors.textPrimary }}>
                    Disponible para entrega inmediata
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VerifiedUser sx={{ color: customColors.mercadoBlue, mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: customColors.textPrimary }}>
                    Garantía de 30 días directamente con nosotros
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Paper elevation={0} sx={{ mt: 3, borderRadius: '16px', backgroundColor: customColors.cardBg, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                color: customColors.textSecondary,
                '&.Mui-selected': {
                  color: customColors.mercadoBlue,
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: customColors.mercadoBlue,
              }
            }}
          >
            <Tab label="Información del producto" />
            <Tab label="Características" />
            <Tab label="Guía de tallas" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 2 }}>
                  Descripción
                </Typography>
                <Typography variant="body2" sx={{ color: customColors.textSecondary, mb: 2, lineHeight: 1.6 }}>
                  GisLive Boutique Clínica presenta una línea de uniformes médicos diseñados con los más altos estándares de calidad y comodidad. Nuestros productos están fabricados con materiales premium que garantizan durabilidad y resistencia durante largas jornadas laborales. La tela antimicrobiana y antifluidos ofrece protección adicional en entornos clínicos, mientras que su diseño ergonómico permite libertad de movimiento.
                </Typography>
                <Typography variant="body2" sx={{ color: customColors.textSecondary, lineHeight: 1.6 }}>
                  Ideal para profesionales de la salud que buscan uniformes que combinen funcionalidad y estilo. Disponible en diversos colores y tallas para adaptarse a sus preferencias y necesidades.
                </Typography>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: customColors.textPrimary }}>
                  Características del producto
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '8px', 
                      border: `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                        Material
                      </Typography>
                      <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                        65% Poliéster, 35% Algodón
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '8px', 
                      border: `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                        Cuidados
                      </Typography>
                      <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                        Lavado a máquina, temperatura media
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '8px', 
                      border: `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                        Características
                      </Typography>
                      <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                        Antimicrobiano, Antifluidos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: '8px', 
                      border: `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>
                        Bolsillos
                      </Typography>
                      <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                        Múltiples bolsillos funcionales
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: customColors.textPrimary }}>
                  Guía de tallas
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: customColors.textSecondary }}>
                  Consulta nuestra tabla de tallas para el ajuste perfecto:
                </Typography>
                <Box sx={{ 
                  borderRadius: '8px',
                  border: `1px solid ${alpha(customColors.textPrimary, 0.1)}`,
                  overflow: 'hidden'
                }}>
                  <Grid container sx={{ 
                    fontWeight: 600, 
                    color: customColors.textPrimary, 
                    p: 1.5,
                    backgroundColor: alpha(customColors.background, 0.5)
                  }}>
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
                  ].map((row, index) => (
                    <Grid 
                      container 
                      key={row.size} 
                      sx={{ 
                        py: 1.5,
                        px: 1.5,
                        color: customColors.textSecondary,
                        backgroundColor: index % 2 === 0 ? customColors.white : alpha(customColors.background, 0.3)
                      }}
                    >
                      <Grid item xs={3} sx={{ fontWeight: selectedSize === row.size ? 600 : 400 }}>{row.size}</Grid>
                      <Grid item xs={3}>{row.chest}</Grid>
                      <Grid item xs={3}>{row.waist}</Grid>
                      <Grid item xs={3}>{row.hip}</Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </motion.div>

      {/* Diálogo de zoom */}
      <Dialog
        open={zoomOpen}
        maxWidth="xl"
        onClose={handleCloseZoom}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent 
          sx={{ 
            p: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <IconButton
            onClick={handleCloseZoom}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: customColors.white,
              zIndex: 10
            }}
          >
            <Close />
          </IconButton>

          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Box
              component="img"
              src={productImages[selectedImageIndex]?.url}
              alt={`${product.nombre_producto} - Ampliado`}
              sx={{
                maxWidth: '90%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
            {/* Miniaturas en el diálogo de zoom - solo si hay más de una imagen */}
            {productImages.length > 1 && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 2,
                  gap: 1,
                  flexWrap: 'wrap'
                }}
              >
                {productImages.map((image, index) => (
                  <Box
                    key={image.id}
                    onClick={() => handleChangeImage(index)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '4px',
                      border: index === selectedImageIndex 
                        ? `2px solid ${customColors.white}` 
                        : `1px solid rgba(255,255,255,0.3)`,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,0.3)'
                    }}
                  >
                    <Box
                      component="img"
                      src={image.url}
                      alt={`${product.nombre_producto} - Miniatura ${index + 1}`}
                      sx={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: customColors.mercadoBlue,
            color: customColors.white,
            borderRadius: '8px'
          }
        }}
      />
    </Container>
  );
};

export default DetallesProducto;
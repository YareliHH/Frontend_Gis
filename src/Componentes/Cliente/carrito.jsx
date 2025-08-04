import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Button,
  ListItem,
  CircularProgress,
  Paper,
  Container,
  Divider,
  Alert,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Fade,
  Grid,
  List,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../Autenticacion/AuthContext';
import { useNavigate } from 'react-router-dom';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const containerRef = useRef(null);
  const [recNames, setRecNames] = useState([]);
  const [detRecs, setDetRecs] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [detLoading, setDetLoading] = useState(false);
  const [recError, setRecError] = useState('');
  const [detError, setDetError] = useState('');

  const [shippingCost, setShippingCost] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollNext = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cardWidth = container.firstChild?.offsetWidth || 300;
    const maxIndex = detRecs.length - (isMobile ? 1 : 4);
    setScrollIndex((prev) => {
      const next = Math.min(prev + 1, maxIndex);
      container.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
      return next;
    });
  };

  const scrollPrev = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cardWidth = container.firstChild?.offsetWidth || 300;
    setScrollIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      container.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
      return next;
    });
  };

  const fetchCarrito = async () => {
    try {
      setLoading(true);
      setError(null);
      const usuario_id = user?.id;
      if (!usuario_id) {
        setError('Inicia sesión para ver tu carrito');
        return;
      }
      setUsuarioId(usuario_id);
      const { data } = await axios.get(
        `https://backend-gis-1.onrender.com/api/carrito/${usuario_id}`,
        { withCredentials: true, timeout: 10000 }
      );
      setCarrito(data.productos || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setCarrito([]);
        setError(null);
      } else {
        setError('No se pudo cargar el carrito. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const parsePrice = (price) => {
    const n = parseFloat(price);
    return isNaN(n) ? 0 : n;
  };

  const total = carrito.reduce(
    (acc, item) => acc + parsePrice(item.precio) * (parseInt(item.cantidad) || 1),
    0
  );

  const calculateShippingCost = async () => {
    if (!carrito.length) {
      setShippingCost(0);
      return;
    }
    try {
      setShippingLoading(true);
      setShippingError(null);
      const totalQuantity = carrito.reduce((acc, item) => acc + parseInt(item.cantidad), 0);
      const payload = {
        num_items: carrito.length,
        subtotal: total,
        total_quantity: totalQuantity,
        total: total,
        estado: 0.0,
      };
      const { data } = await axios.post(
        'https://flaskenvios.onrender.com/calcular_envio',
        payload,
        { timeout: 10000 }
      );
      setShippingCost(typeof data.costo_envio === 'number' ? data.costo_envio : 0);
    } catch (err) {
      console.error(err);
      setShippingError(err.response?.data?.message || 'No se pudo calcular el costo de envío. Intenta de nuevo.');
      setShippingCost(0);
    } finally {
      setShippingLoading(false);
    }
  };

  const fetchRecNames = async (productoNombre) => {
    setRecLoading(true);
    setRecError('');
    setRecNames([]);
    try {
      const { data } = await axios.post(
        'https://flask1-yowt.onrender.com/recomendar',
        { productos: [productoNombre] },
        { timeout: 10000 }
      );
      console.log("Productos recomendados:", data);
      setRecNames(data || []);
    } catch (err) {
      console.error(err);
      setRecError('No se pudieron cargar recomendaciones');
      setRecNames([]);
    } finally {
      setRecLoading(false);
    }
  };

  const fetchDetRecs = async (names) => {
    if (!names.length) return setDetRecs([]);
    setDetLoading(true);
    setDetError('');
    setDetRecs([]);
    const cleanedNames = names.map(name => name.trim());
    try {
      const { data } = await axios.post(
        "https://backend-gis-1.onrender.com/api/productos/recomendados",
        { recomendaciones: cleanedNames },
        { timeout: 10000 }
      );
      console.log("Productos recomendados detalles:", data);
      setDetRecs(data);
    } catch (err) {
      console.error(err);
      setDetError('No se pudieron cargar detalles de recomendaciones');
      setDetRecs([]);
    } finally {
      setDetLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchCarrito();
    else {
      setLoading(false);
      setError(null);
      setCarrito([]);
    }
  }, [user]);

  useEffect(() => {
    if (carrito.length) {
      fetchRecNames(carrito[0].nombre_producto);
      calculateShippingCost();
    } else {
      setRecNames([]);
      setDetRecs([]);
      setShippingCost(0);
    }
  }, [carrito, total]);

  useEffect(() => {
    if (recNames.length) {
      fetchDetRecs(recNames);
    } else {
      setDetRecs([]);
    }
  }, [recNames]);

  const agregarProducto = async (producto_id, cantidad, precio_unitario) => {
    try {
      await axios.post(
        "https://backend-gis-1.onrender.com/api/agregar",
        { usuario_id: usuarioId, producto_id, cantidad, precio_unitario },
        { withCredentials: true }
      );
      await fetchCarrito();
    } catch {
      setError("No se pudo agregar el producto al carrito.");
    }
  };

  const eliminarProducto = async (producto_id) => {
    try {
      await axios.delete(
        `https://backend-gis-1.onrender.com/api/carrito/eliminar/${usuarioId}/${producto_id}`,
        { withCredentials: true }
      );
      await fetchCarrito();
    } catch {
      setError("No se pudo eliminar el producto.");
    }
  };

  const vaciarCarrito = async () => {
    try {
      await axios.delete(
        `https://backend-gis-1.onrender.com/api/carrito/vaciar/${usuarioId}`,
        { withCredentials: true }
      );
      await fetchCarrito();
    } catch {
      setError("No se pudo vaciar el carrito.");
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchCarrito();
  };

  const totalWithShipping = total + (parseFloat(shippingCost) || 0);

  const handleEliminarProducto = (event, producto_id) => {
    event.preventDefault();
    eliminarProducto(producto_id);
  };

  const handleRealizarCompra = () => {
    if (!carrito || carrito.length === 0 || total <= 0) {
      setError('El carrito está vacío o el total es inválido. Agrega productos para continuar.');
      return;
    }
    navigate('/cliente/envios', {
      state: { carrito, total: totalWithShipping, shippingCost },
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: 3,
        bgcolor: 'background.default',
      }}>
        <CircularProgress size={80} thickness={4} color="primary" />
        <Typography variant="h6" color="text.secondary" fontWeight="medium">
          Cargando tu carrito...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Fade in>
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              boxShadow: 2,
              py: 2,
              px: 3,
              display: 'flex',
              alignItems: 'center',
            }}
            action={
              <Button
                size="medium"
                onClick={handleRetry}
                startIcon={<RefreshIcon />}
                variant="outlined"
                color="error"
                sx={{ borderRadius: 20 }}
              >
                Reintentar
              </Button>
            }
          >
            <Typography variant="body1">{error}</Typography>
          </Alert>
        </Fade>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Fade in>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 100, mb: 3, color: 'primary.main' }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Inicia sesión para ver tu carrito
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: 20,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.3)' },
              }}
            >
              Iniciar Sesión
            </Button>
          </Paper>
        </Fade>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 4 } }}>
        <Fade in>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 5,
                flexDirection: isMobile ? 'column' : 'row',
                gap: 3,
              }}
            >
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                fontWeight="bold"
                color="text.primary"
              >
                Tu Carrito
                <ShoppingCartIcon
                  sx={{ ml: 1.5, verticalAlign: 'middle', fontSize: 36, color: 'primary.main' }}
                />
              </Typography>
              {carrito.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchCarrito}
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      px: 3,
                      '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' },
                    }}
                  >
                    Actualizar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RemoveShoppingCartIcon />}
                    onClick={vaciarCarrito}
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      px: 3,
                      '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' },
                    }}
                  >
                    Vaciar Carrito
                  </Button>
                </Box>
              )}
            </Box>

            {carrito.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <ShoppingCartIcon sx={{ fontSize: 140, mb: 4, opacity: 0.6, color: 'text.secondary' }} />
                <Typography variant="h5" gutterBottom fontWeight="medium" color="text.secondary">
                  Tu carrito está vacío
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/cliente')}
                  sx={{
                    borderRadius: 20,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.3)' },
                  }}
                >
                  Explorar Productos
                </Button>
              </Box>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                  {carrito.map((item, idx) => (
                    <Card
                      key={idx}
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <ListItem
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={(event) => handleEliminarProducto(event, item.producto_id)}
                            sx={{
                              bgcolor: 'error.light',
                              color: 'error.contrastText',
                              '&:hover': { bgcolor: 'error.main' },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                        sx={{ py: 2 }}
                      >
                        <CardMedia
                          component="img"
                          image={item.imagen_url || '/placeholder.jpg'}
                          alt={item.nombre_producto}
                          sx={{
                            width: isMobile ? '40%' : 180,
                            height: 180,
                            objectFit: 'cover',
                            borderRadius: 2,
                            mr: 3,
                          }}
                        />
                        <CardContent sx={{ flex: 1, py: 2 }}>
                          <Typography variant="h6" fontWeight="bold" color="text.primary">
                            {item.nombre_producto}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                            <Chip
                              label={`Cantidad: ${item.cantidad}`}
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                fontWeight: 'medium',
                              }}
                            />
                            <Chip
                              label={`Precio: $${parsePrice(item.precio).toFixed(2)}`}
                              sx={{
                                bgcolor: 'secondary.light',
                                color: 'secondary.contrastText',
                                fontWeight: 'medium',
                              }}
                            />
                          </Box>
                        </CardContent>
                      </ListItem>
                      <Divider />
                    </Card>
                  ))}
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Paper
                    sx={{
                      p: 4,
                      position: 'sticky',
                      top: 20,
                      borderRadius: 3,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      bgcolor: 'background.paper',
                      maxHeight: '70vh',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: '8px' },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'grey.400',
                        borderRadius: '4px',
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Resumen de la compra
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="subtitle1" fontWeight="medium" color="text.secondary" gutterBottom>
                      Productos
                    </Typography>
                    <List dense sx={{ mb: 2 }}>
                      {carrito.map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 1, px: 0 }}>
                          <ListItemText
                            primary={
                              <Typography variant="body2" color="text.primary">
                                {item.nombre_producto}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Cantidad: {item.cantidad}
                                </Typography>
                                <Typography variant="caption" fontWeight="medium">
                                  ${(parsePrice(item.precio) * parseInt(item.cantidad)).toFixed(2)}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        Subtotal ({carrito.length})
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        Envío
                      </Typography>
                      {shippingLoading ? (
                        <CircularProgress size={20} />
                      ) : shippingError ? (
                        <Typography variant="body1" color="error.main">
                          Error
                        </Typography>
                      ) : (
                        <Typography variant="body1" fontWeight="medium" color="success.main">
                          ${shippingCost.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        ${totalWithShipping.toFixed(2)}
                      </Typography>
                    </Box>
                    {shippingError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {shippingError}
                        <Button size="small" onClick={calculateShippingCost}>
                          Reintentar
                        </Button>
                      </Alert>
                    )}
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleRealizarCompra}
                        disabled={shippingLoading || shippingError}
                        sx={{
                          borderRadius: 20,
                          textTransform: 'none',
                          py: 1.5,
                          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                          '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.3)' },
                        }}
                      >
                        Realizar Compra
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/cliente')}
                        sx={{
                          borderRadius: 20,
                          textTransform: 'none',
                          py: 1.5,
                          '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' },
                        }}
                      >
                        Seguir Comprando
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Fade>
      </Container>

      {!detLoading && !detError && detRecs.length > 0 && (
        <Container maxWidth="xl" sx={{ py: 6 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 4, textAlign: 'center', color: 'text.primary' }}
          >
            Productos Recomendados
          </Typography>
          <Box sx={{ position: 'relative', px: { xs: 2, sm: 6 } }}>
            <Button
              onClick={scrollPrev}
              disabled={scrollIndex === 0}
              sx={{
                position: 'absolute',
                top: '40%',
                left: { xs: -10, sm: 0 },
                zIndex: 10,
                minWidth: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                color: 'text.primary',
                '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' },
                '&:disabled': { bgcolor: 'grey.200', color: 'grey.500' },
              }}
            >
              ←
            </Button>

            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                gap: 3,
                py: 2,
                px: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none',
              }}
            >
              {detRecs.map((prod) => (
                <Card
                  key={prod.id}
                  sx={{
                    flex: '0 0 auto',
                    width: isMobile ? '85vw' : 280,
                    borderRadius: 3,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={prod.imagen_url || '/placeholder.jpg'}
                    alt={prod.nombre_producto}
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {prod.nombre_producto}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {prod.descripcion}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      ${parsePrice(prod.precio).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Stock: {prod.stock}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => agregarProducto(prod.id, 1, prod.precio)}
                      sx={{
                        borderRadius: 20,
                        textTransform: 'none',
                        py: 1,
                        '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' },
                      }}
                    >
                      Añadir al carrito
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>

            <Button
              onClick={scrollNext}
              disabled={scrollIndex >= detRecs.length - (isMobile ? 1 : 4)}
              sx={{
                position: 'absolute',
                top: '40%',
                right: { xs: -10, sm: 0 },
                zIndex: 10,
                minWidth: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                color: 'text.primary',
                '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' },
                '&:disabled': { bgcolor: 'grey.200', color: 'grey.500' },
              }}
            >
              →
            </Button>
          </Box>
        </Container>
      )}
    </>
  );
};

export default Carrito;
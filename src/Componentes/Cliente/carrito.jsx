import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Button,
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Función para obtener el carrito del usuario
  const fetchCarrito = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🛒 Obteniendo carrito...');
      console.log('👤 Usuario actual:', user);

      // Verificar que el usuario esté autenticado y tenga ID
      const usuario_id = user?.id;
      console.log('🆔 ID del usuario:', usuario_id);

      if (!usuario_id) {
        setError('Inicia sesión para ver tu carrito');
        setLoading(false);
        return;
      }

      setUsuarioId(usuario_id);

      // Hacer petición al carrito con credentials
      const response = await axios.get(
        `https://backend-gis-1.onrender.com/api/carrito/${usuario_id}`,
        { 
          withCredentials: true,
          timeout: 10000
        }
      );

      console.log('📡 Respuesta del carrito:', response.data);

      // Manejar respuesta exitosa
      if (response.data.productos) {
        setCarrito(response.data.productos);
        console.log('✅ Carrito cargado:', response.data.productos.length, 'productos');
      } else {
        // Si no hay productos, establecer carrito vacío
        setCarrito([]);
        console.log('📭 Carrito vacío');
      }

    } catch (error) {
      console.error("❌ Error al obtener el carrito:", error);

      // Manejar diferentes tipos de errores
      if (error.response?.status === 404 || 
          error.response?.data?.error === "El carrito está vacío" ||
          error.response?.data?.message === "El carrito está vacío") {
        // Carrito vacío - NO es un error
        console.log('📭 Carrito vacío (desde error)');
        setCarrito([]);
        setError(null);
      } else if (error.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (error.code === 'ECONNABORTED') {
        setError('Tiempo de espera agotado. Verifica tu conexión.');
      } else {
        setError('No se pudo cargar el carrito. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito cuando el componente se monta o el usuario cambia
  useEffect(() => {
    console.log('🔄 useEffect ejecutándose');
    console.log('👤 Usuario disponible:', !!user);
    console.log('🆔 ID disponible:', !!user?.id);

    if (user?.id) {
      fetchCarrito();
    } else if (user === null) {
      // Usuario no autenticado
      setLoading(false);
      setError(null);
      setCarrito([]);
    }
  }, [user]); // Dependencia en user

  // Función para agregar producto al carrito
  const agregarProducto = async (producto_id, cantidad, precio_unitario) => {
    try {
      console.log('➕ Agregando producto:', { producto_id, cantidad, precio_unitario });

      if (!usuarioId) {
        setError('Usuario no identificado');
        return;
      }

      await axios.post(
        "https://backend-gis-1.onrender.com/api/agregar",
        {
          usuario_id: usuarioId,
          producto_id,
          cantidad,
          precio_unitario
        },
        { withCredentials: true }
      );

      console.log('✅ Producto agregado');
      await fetchCarrito();
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
      setError("No se pudo agregar el producto al carrito.");
    }
  };

  // Función para eliminar producto del carrito
  const eliminarProducto = async (producto_id) => {
    try {
      console.log('🗑️ Eliminando producto:', producto_id);

      if (!usuarioId) {
        setError('Usuario no identificado');
        return;
      }

      await axios.delete(
        `https://backend-gis-1.onrender.com/api/carrito/eliminar/${usuarioId}/${producto_id}`,
        { withCredentials: true }
      );

      console.log('✅ Producto eliminado');
      await fetchCarrito();
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
      setError("No se pudo eliminar el producto.");
    }
  };

  // Función para vaciar el carrito completo
  const vaciarCarrito = async () => {
    try {
      console.log('🗑️ Vaciando carrito');

      if (!usuarioId) {
        setError('Usuario no identificado');
        return;
      }

      await axios.delete(
        `https://backend-gis-1.onrender.com/api/carrito/vaciar/${usuarioId}`,
        { withCredentials: true }
      );

      console.log('✅ Carrito vaciado');
      await fetchCarrito();
    } catch (error) {
      console.error("❌ Error al vaciar el carrito:", error);
      setError("No se pudo vaciar el carrito.");
    }
  };

  // Función para reintentar la carga
  const handleRetry = () => {
    setError(null);
    fetchCarrito();
  };

  // Función para convertir precio a número
  const parsePrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? 0 : num;
  };

  // Calcular total del carrito
  const total = carrito.reduce((acc, item) => {
    const precio = parsePrice(item.precio);
    const cantidad = parseInt(item.cantidad) || 1;
    return acc + (cantidad * precio);
  }, 0);

  // Estado de carga
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando tu carrito...
        </Typography>
      </Container>
    );
  }

  // Estado de error con opción de reintento
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in={true}>
          <Alert 
            severity="error" 
            sx={{ borderRadius: 2, boxShadow: 1 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRetry}
                startIcon={<RefreshIcon />}
              >
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        </Fade>
      </Container>
    );
  }

  // Usuario no autenticado
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Fade in={true}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Inicia sesión para ver tu carrito
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Accede a tu cuenta para gestionar tus productos
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
              startIcon={<ShoppingCartIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5
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
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 3, md: 6 },
        px: { xs: 2, sm: 3 }
      }}
    >
      <Fade in={true}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {/* Encabezado del carrito */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2
          }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              fontWeight="bold"
              color="primary.main"
            >
              Tu Carrito
              <ShoppingCartIcon sx={{ ml: 1, verticalAlign: 'middle', fontSize: 32 }} />
            </Typography>
            
            {carrito.length > 0 && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={fetchCarrito}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 2,
                    py: 1
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
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    py: 1
                  }}
                >
                  Vaciar Carrito
                </Button>
              </Box>
            )}
          </Box>

          {/* Carrito vacío */}
          {carrito.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingCartIcon sx={{ 
                fontSize: 120, 
                color: 'text.secondary', 
                mb: 3,
                opacity: 0.7
              }} />
              <Typography variant="h5" color="text.secondary" fontWeight="medium" gutterBottom>
                Tu carrito está vacío
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                ¡Descubre nuestros productos y encuentra algo que te guste!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/cliente')}
                sx={{ 
                  borderRadius: 3, 
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Explorar Productos
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Columna de productos */}
              <Grid item xs={12} lg={8}>
                <List disablePadding>
                  {carrito.map((item, index) => (
                    <React.Fragment key={item.producto_id || index}>
                      <Card
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <ListItem
                          sx={{
                            p: 2,
                            alignItems: 'flex-start',
                            gap: 3,
                            flexDirection: isMobile ? 'column' : 'row'
                          }}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="eliminar producto"
                              onClick={() => eliminarProducto(item.producto_id)}
                              sx={{
                                color: 'error.main',
                                transition: 'all 0.2s',
                                '&:hover': { 
                                  bgcolor: 'error.light', 
                                  color: 'white',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          {/* Imagen del producto */}
                          <CardMedia
                            component="img"
                            sx={{
                              width: isMobile ? '100%' : 150,
                              height: 150,
                              borderRadius: 2,
                              objectFit: 'cover',
                              bgcolor: 'grey.100',
                              border: '1px solid',
                              borderColor: 'grey.200'
                            }}
                            image={item.imagen_url || '/placeholder.jpg'}
                            alt={item.nombre_producto || 'Producto'}
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                          
                          {/* Información del producto */}
                          <CardContent sx={{ flex: 1, p: 0 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {item.nombre_producto || 'Producto sin nombre'}
                            </Typography>
                            
                            <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                              <Chip
                                label={`Cantidad: ${item.cantidad || 1}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={`Precio unitario: ${parsePrice(item.precio).toFixed(2)}`}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                              <Chip
                                label={`Subtotal: ${(parsePrice(item.precio) * (parseInt(item.cantidad) || 1)).toFixed(2)}`}
                                size="small"
                                color="secondary"
                                variant="filled"
                              />
                            </Box>
                            
                            {item.descripcion && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ 
                                  lineHeight: 1.6,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                {item.descripcion}
                              </Typography>
                            )}
                          </CardContent>
                        </ListItem>
                      </Card>
                      {index < carrito.length - 1 && <Divider sx={{ my: 1 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>

            {/* Columna del resumen y pago */}
<Grid item xs={12} lg={4}>
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 2,
      position: 'sticky',
      top: 20,
      border: '1px solid',
      borderColor: 'grey.200'
    }}
  >
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Resumen de la compra
    </Typography>

    <Divider sx={{ my: 2 }} />

    {/* Lista de productos con detalles */}
    <Box sx={{ mb: 3, maxHeight: 300, overflowY: 'auto' }}>
      {carrito.map((item, index) => (
        <Box
          key={item.producto_id || index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': { borderBottom: 'none' }
          }}
        >
          {/* Imagen del producto */}
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            {item.imagen_url ? (
              <img
                src={item.imagen_url}
                alt={item.nombre_producto}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: item.imagen_url ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="caption">
                IMG
              </Typography>
            </Box>
          </Box>

          {/* Info del producto */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{
                mb: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {item.nombre_producto || 'Producto'}
            </Typography>
            <Typography variant="caption" display="block">
              Cantidad: {item.cantidad || 1}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              ${(
                parsePrice(item.precio) *
                (parseInt(item.cantidad) || 1)
              ).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>

    <Divider sx={{ my: 2 }} />

    {/* Subtotal */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1
      }}
    >
      <Typography variant="body2">
        Subtotal ({carrito.length} producto{carrito.length !== 1 ? 's' : ''})
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        ${total.toFixed(2)}
      </Typography>
    </Box>

    {/* Envío */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}
    >
      <Typography variant="body2">
        Envío
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        Gratis
      </Typography>
    </Box>

    <Divider sx={{ my: 2 }} />

    {/* Total */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        p: 2,
        borderRadius: 2
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Total
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        ${total.toFixed(2)}
      </Typography>
    </Box>

    {/* Botones */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={() => navigate('/cliente/envios')}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}
      >
        Realizar Compra
      </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/cliente')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  py: 1
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
  );
};

export default Carrito;
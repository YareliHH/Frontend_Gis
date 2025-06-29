import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
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

  const fetchCarrito = async () => {
    try {
      const usuario_id = user?.id;
      console.log('usuarioid', usuario_id);

      if (!usuario_id) {
        setError('Inicia sesión para ver tu carrito');
        setLoading(false);
        return;
      }

      setUsuarioId(usuario_id);
      const response = await axios.get(`http://localhost:3001/api/carrito/${usuario_id}`);
      setCarrito(response.data.productos);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      setError("No se pudo cargar el carrito. Intente de nuevo.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  const agregarProducto = async (producto_id, cantidad, precio_unitario) => {
    try {
      await axios.post("http://localhost:3001/api/agregar", {
        usuario_id: usuarioId,
        producto_id,
        cantidad,
        precio_unitario
      });
      await fetchCarrito();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setError("No se pudo agregar el producto al carrito.");
    }
  };

  const eliminarProducto = async (producto_id) => {
    try {
      await axios.delete(`http://localhost:3001/api/carrito/eliminar/${usuarioId}/${producto_id}`);
      await fetchCarrito();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setError("No se pudo eliminar el producto.");
    }
  };

  const vaciarCarrito = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/carrito/vaciar/${usuarioId}`);
      await fetchCarrito();
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      setError("No se pudo vaciar el carrito.");
    }
  };

  const total = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in={true}>
          <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 1 }}>
            {error}
          </Alert>
        </Fade>
      </Container>
    );
  }

  if (!usuarioId) {
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
              onClick={() => window.location.href = '/login'}
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
            )}
          </Box>

          {carrito.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Tu carrito está vacío
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
                onClick={() => window.location.href = '/productos'}
              >
                Explorar Productos
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Columna de productos */}
              <Grid item xs={12} lg={8}>
                <List disablePadding>
                  {carrito.map((item) => (
                    <React.Fragment key={item.producto_id}>
                      <Card
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-2px)' }
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
                              aria-label="delete"
                              onClick={() => eliminarProducto(item.producto_id)}
                              sx={{
                                color: 'error.main',
                                '&:hover': { bgcolor: 'error.light', color: 'white' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <CardMedia
                            component="img"
                            sx={{
                              width: isMobile ? '100%' : 150,
                              height: 150,
                              borderRadius: 2,
                              objectFit: 'cover',
                              bgcolor: 'grey.100'
                            }}
                            image={item.imagen_url || '/placeholder.jpg'}
                            alt={item.nombre_producto}
                          />
                          <CardContent sx={{ flex: 1, p: 0 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {item.nombre_producto}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <Chip
                                label={`Cantidad: ${item.cantidad}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={`Precio: $${item.precio}`}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1, lineHeight: 1.6 }}
                            >
                              {item.descripcion}
                            </Typography>
                          </CardContent>
                        </ListItem>
                      </Card>
                      <Divider sx={{ my: 1 }} />
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
                    bgcolor: 'background.default'
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Resumen del Pedido
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Productos en tu carrito:
                    </Typography>
                    {carrito.map((item) => (
                      <Box key={item.producto_id} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 0.5
                      }}>
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {item.nombre_producto} x{item.cantidad}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={() => navigate('/cliente/pago')}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.2)' }
                    }}
                  >
                    Proceder al Pago
                  </Button>
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
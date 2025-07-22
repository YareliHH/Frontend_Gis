import React, { useEffect, useState } from "react";
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

  // Estados para nombres de recomendaciones y detalles
  const [recNames, setRecNames] = useState([]);
  const [detRecs, setDetRecs] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [detLoading, setDetLoading] = useState(false);
  const [recError, setRecError] = useState('');
  const [detError, setDetError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 1) Obtener carrito
  const fetchCarrito = async () => {
    try {
      setLoading(true); setError(null);
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
        setCarrito([]); setError(null);
      } else {
        setError('No se pudo cargar el carrito. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2) Pedir nombres de recomendados
  const fetchRecNames = async (productoNombre) => {
    setRecLoading(true); setRecError(''); setRecNames([]);
    try {
      const { data } = await axios.post(
        'https://flaskg-v1x1.onrender.com/recomendar',
        { producto: productoNombre },
        { timeout: 10000 }
      );
      setRecNames(data.recomendaciones || []);
    } catch (err) {
      console.error(err);
      setRecError('No se pudieron cargar recomendaciones');
      setRecNames([]);
    } finally {
      setRecLoading(false);
    }
  };

  // 3) Pedir detalles de recomendados
  const fetchDetRecs = async (names) => {
    if (!names.length) return setDetRecs([]);
    setDetLoading(true); setDetError(''); setDetRecs([]);
    try {
      const { data } = await axios.post(
        "https://backend-gis-1.onrender.com/api/productos/recomendados",
        { recomendaciones: names },
        { timeout: 10000 }
      );
      setDetRecs(data);
    } catch (err) {
      console.error(err);
      setDetError('No se pudieron cargar detalles de recomendaciones');
      setDetRecs([]);
    } finally {
      setDetLoading(false);
    }
  };

  // Montaje: carga carrito
  useEffect(() => {
    if (user?.id) fetchCarrito();
    else {
      setLoading(false);
      setError(null);
      setCarrito([]);
    }
  }, [user]);

  // Cuando cambia carrito: pide recomendaciones para el primer ítem
  useEffect(() => {
    if (carrito.length) {
      fetchRecNames(carrito[0].nombre_producto);
    } else {
      setRecNames([]);
      setDetRecs([]);
    }
  }, [carrito]);

  // Cuando llegan los nombres: pide detalles
  useEffect(() => {
    if (recNames.length) {
      fetchDetRecs(recNames);
    } else {
      setDetRecs([]);
    }
  }, [recNames]);

  // Funciones de carrito (agregar / eliminar / vaciar)
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

  const parsePrice = (price) => {
    const n = parseFloat(price);
    return isNaN(n) ? 0 : n;
  };
  const total = carrito.reduce(
    (acc, item) => acc + parsePrice(item.precio) * (parseInt(item.cantidad) || 1),
    0
  );

  // Render loading / error / no user
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{
        display:'flex', flexDirection:'column',
        justifyContent:'center', alignItems:'center',
        minHeight:'60vh', gap:2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando tu carrito...
        </Typography>
      </Container>
    );
  }
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py:4 }}>
        <Fade in>
          <Alert severity="error" action={
            <Button size="small" onClick={handleRetry} startIcon={<RefreshIcon />}>
              Reintentar
            </Button>
          }>
            {error}
          </Alert>
        </Fade>
      </Container>
    );
  }
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py:6 }}>
        <Fade in>
          <Paper elevation={6} sx={{ p:4, textAlign:'center', borderRadius:3 }}>
            <ShoppingCartIcon sx={{ fontSize:80, mb:2 }} />
            <Typography variant="h5" gutterBottom>
              Inicia sesión para ver tu carrito
            </Typography>
            <Button variant="contained" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
          </Paper>
        </Fade>
      </Container>
    );
  }

  return (
    <>
      {/* ====== CONTENEDOR DEL CARRITO (sin cambios) ====== */}
      <Container maxWidth="xl" sx={{ py:{ xs:3, md:6 }, px:{ xs:2, sm:3 } }}>
        <Fade in>
          <Paper elevation={6} sx={{ p:{ xs:2, sm:4 }, borderRadius:3 }}>
            <Box sx={{
              display:'flex', justifyContent:'space-between',
              alignItems:'center', mb:4,
              flexDirection: isMobile?'column':'row',
              gap:2
            }}>
              <Typography variant={isMobile?"h5":"h4"} fontWeight="bold">
                Tu Carrito <ShoppingCartIcon sx={{ ml:1, verticalAlign:'middle', fontSize:32 }} />
              </Typography>
              {carrito.length > 0 && (
                <Box sx={{ display:'flex', gap:2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchCarrito}
                  >
                    Actualizar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RemoveShoppingCartIcon />}
                    onClick={vaciarCarrito}
                  >
                    Vaciar Carrito
                  </Button>
                </Box>
              )}
            </Box>

            {carrito.length === 0 ? (
              <Box sx={{ textAlign:'center', py:8 }}>
                <ShoppingCartIcon sx={{ fontSize:120, mb:3, opacity:0.7 }} />
                <Typography variant="h5" gutterBottom>
                  Tu carrito está vacío
                </Typography>
                <Button variant="contained" onClick={() => navigate('/cliente')}>
                  Explorar Productos
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                  {carrito.map((item, idx) => (
                    <Card key={idx} sx={{ mb:2 }}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" onClick={() => eliminarProducto(item.producto_id)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <CardMedia
                          component="img"
                          image={item.imagen_url || '/placeholder.jpg'}
                          alt={item.nombre_producto}
                          sx={{
                            width: isMobile?'100%':150,
                            height:150,
                            objectFit:'cover',
                            borderRadius:2
                          }}
                        />
                        <CardContent sx={{ flex:1 }}>
                          <Typography variant="h6">{item.nombre_producto}</Typography>
                          <Box sx={{ display:'flex', gap:2, mt:1 }}>
                            <Chip label={`Cantidad: ${item.cantidad}`} />
                            <Chip label={`Precio: ${parsePrice(item.precio).toFixed(2)}`} />
                          </Box>
                        </CardContent>
                      </ListItem>
                      <Divider />
                    </Card>
                  ))}
                </Grid>

                <Grid item xs={12} lg={4}>
                  <Paper sx={{ p:3, position:'sticky', top:20 }}>
                    <Typography variant="h6" gutterBottom>
                      Resumen de la compra
                    </Typography>
                    <Divider sx={{ my:2 }} />
                    <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                      <Typography>Subtotal ({carrito.length} items)</Typography>
                      <Typography>${total.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display:'flex', justifyContent:'space-between', mt:1 }}>
                      <Typography>Envío</Typography>
                      <Typography>Gratis</Typography>
                    </Box>
                    <Divider sx={{ my:2 }} />
                    <Box sx={{ mt:3, display:'flex', flexDirection:'column', gap:2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/cliente/envios')}
                      >
                        Realizar Compra
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/cliente')}
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

      {/* ====== BLOQUE DE PRODUCTOS RECOMENDADOS CON DETALLES ====== */}
      <Container maxWidth="xl" sx={{ mt:4, mb:6 }}>
        <Typography variant="h5" gutterBottom>
          Tambien te puede interesar
        </Typography>
        {detLoading && <CircularProgress size={32} sx={{ mt:2 }} />}
        {detError && <Alert severity="warning" sx={{ mt:2 }}>{detError}</Alert>}
        {!detLoading && !detError && detRecs.length > 0 && (
          <Grid container spacing={3}>
            {detRecs.map((prod) => (
              <Grid item key={prod.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height:'100%', display:'flex', flexDirection:'column' }}>
                  <CardMedia
                    component="img"
                    image={prod.imagen_url || '/placeholder.jpg'}
                    alt={prod.nombre_producto}
                    sx={{ height: 180, objectFit:'cover' }}
                  />
                  <CardContent sx={{ flexGrow:1 }}>
                    <Typography variant="h6" gutterBottom>
                      {prod.nombre_producto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb:1 }}>
                      {prod.descripcion}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ${parsePrice(prod.precio).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Stock: {prod.stock}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p:2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => agregarProducto(prod.id, 1, prod.precio)}
                    >
                      Añadir al carrito
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {!detLoading && !detError && detRecs.length === 0 && (
          <Typography color="text.secondary" sx={{ mt:2 }}>
            No hay recomendaciones para mostrar.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default Carrito;

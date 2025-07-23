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

  // Justo después de tus otros useState al inicio del componente
  const [scrollIndex, setScrollIndex] = useState(0);
  const containerRef = React.useRef(null);

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

  const scrollNext = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const cardWidth = container.firstChild?.offsetWidth || 300; // ancho aproximado de tarjeta
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
        'https://flask1-yowt.onrender.com/recomendar',
        { productos: [productoNombre] }, // ✅ lo que Flask espera
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

  // 3) Pedir detalles de recomendados
  const fetchDetRecs = async (names) => {
    if (!names.length) return setDetRecs([]);
    setDetLoading(true); setDetError(''); setDetRecs([]);

    // Limpiar nombres recibidos: quitar espacios al inicio y fin
    const cleanedNames = names.map(name => name.trim());

    try {
      const { data } = await axios.post(
        "https://backend-gis-1.onrender.com/api/productos/recomendados",
        { recomendaciones: cleanedNames },  // envío limpio
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
      {!detLoading && !detError && detRecs.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          {/* Botón flecha izquierda */}
          <Button
            onClick={scrollPrev}
            disabled={scrollIndex === 0}
            sx={{
              position: 'absolute',
              top: '40%',
              left: 0,
              zIndex: 10,
              minWidth: '36px',
              height: '36px',
              borderRadius: '50%',
              bgcolor: 'background.paper',
              boxShadow: 1,
            }}
          >
            &#8592;
          </Button>

          {/* Contenedor scroll horizontal */}
          <Box
            ref={containerRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              gap: 2,
              pb: 1,
              px: 3, // <-- padding horizontal para separar tarjetas de flechas
              // Ocultar scrollbar para mejor estética:
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
                  width: isMobile ? '80vw' : 250,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <CardMedia
                  component="img"
                  image={prod.imagen_url || '/placeholder.jpg'}
                  alt={prod.nombre_producto}
                  sx={{ height: 180, objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {prod.nombre_producto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {prod.descripcion}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${parsePrice(prod.precio).toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Stock: {prod.stock}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => agregarProducto(prod.id, 1, prod.precio)}
                  >
                    Añadir al carrito
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Botón flecha derecha */}
          <Button
            onClick={scrollNext}
            disabled={scrollIndex >= detRecs.length - (isMobile ? 1 : 4)}
            sx={{
              position: 'absolute',
              top: '40%',
              right: 0,
              zIndex: 10,
              minWidth: '36px',
              height: '36px',
              borderRadius: '50%',
              bgcolor: 'background.paper',
              boxShadow: 1,
            }}
          >
            &#8594;
          </Button>
        </Box>
      )}
    </>
  );
};

export default Carrito;

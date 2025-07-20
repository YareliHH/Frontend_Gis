import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const MercadoPago = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state || !Array.isArray(location.state.carrito)) {
      setError('No se recibió información del carrito. Regresa e intenta de nuevo.');
      return;
    }
    setCarrito(location.state.carrito);
    setTotal(location.state.total || 0);
    localStorage.setItem('carrito', JSON.stringify(location.state.carrito));
  }, [location.state]);

  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const pagarConMercadoPago = async () => {
    try {
      setLoading(true);
      setError(null);

      const carritoValido = carrito.every((item) => {
        const precio = Number(item.precio_carrito);
        const cantidad = Number(item.cantidad_carrito);
        return !isNaN(precio) && !isNaN(cantidad) && precio > 0 && cantidad > 0;
      });

      if (!carritoValido) throw new Error('Uno o más productos tienen datos inválidos.');

      const response = await fetch('https://backendcentro.onrender.com/api/pagos/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrito }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (!data.init_point) throw new Error('No se recibió la URL de pago.');

      window.location.href = data.init_point;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón regresar */}
      <Box sx={{ maxWidth: '650px', margin: 'auto', mb: 2 }}>
        <Button
          onClick={() => navigate('/cliente/envios')}
          startIcon={<ArrowBackIosIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            textTransform: 'none',
            border: 'none',
            background: 'none',
            color: 'primary.main',
            fontSize: '1rem',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              background: 'none',
            },
            pl: 0,
          }}
        >
          Regresar al envío
        </Button>
      </Box>

      {/* Contenedor principal */}
      <Paper elevation={3} sx={{
        maxWidth: isMobile ? '100%' : '650px',
        margin: 'auto',
        p: 4,
        borderRadius: 3,
        backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Stack spacing={3}>
          {/* Encabezado */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" fontWeight="bold" color="primary">
              Pagar con Mercado Pago
            </Typography>
            <Box
              component="img"
              src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png"
              alt="Mercado Pago"
              sx={{ height: 50 }}
            />
          </Box>

          <Divider />

          {error && <Alert severity="error">{error}</Alert>}

          {/* Total y detalles */}
          <Box>
            <Typography variant="body1" color="text.secondary">
              Monto total:
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${total.toFixed(2)} MXN
            </Typography>

            {carrito.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Detalles del pedido:
                </Typography>
                <List dense>
                  {carrito.map((item, i) => (
                    <ListItem key={i} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: expandedItems[item.id] ? 'unset' : 2,
                                overflow: 'hidden',
                              }}
                            >
                              {item.nombre} (x{item.cantidad_carrito})
                            </Typography>
                          }
                          secondary={`Subtotal: $${(
                            item.subtotal ||
                            (item.precio_carrito ?? 0) * (item.cantidad_carrito ?? 0)
                          ).toFixed(2)} MXN`}
                          primaryTypographyProps={{ component: 'div' }}
                          secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>

          {/* Botón pagar */}
          <Box display="flex" justifyContent="center">
            <Button
              onClick={pagarConMercadoPago}
              disabled={total === 0 || carrito.length === 0 || loading}
              sx={{
                backgroundColor: '#009ee3',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                '&:hover': { backgroundColor: '#007cb9' },
                '&:disabled': { backgroundColor: '#ccc' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Pagar ahora'}
            </Button>
          </Box>

          {/* Seguridad */}
          <Box display="flex" justifyContent="center" alignItems="center">
            <SecurityIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Pago seguro con Mercado Pago
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </>
  );
};

export default MercadoPago;

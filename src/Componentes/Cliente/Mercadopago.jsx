
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
  CircularProgress,
  Fade,
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

  const pagarConMercadoPago = async () => {
    try {
      setLoading(true);
      setError(null);

      const carritoValido = carrito.every(item => {
        const precio = Number(item.precio_carrito);
        const cantidad = Number(item.cantidad_carrito);
        return !isNaN(precio) && !isNaN(cantidad) && precio > 0 && cantidad > 0;
      });
      if (!carritoValido) throw new Error('Uno o más productos tienen datos inválidos.');

      const response = await fetch(
        'https://backend-gis-1.onrender.com/api/pago/crear_preferencia',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ carrito }),
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (!data.init_point) throw new Error('No se recibió la URL de pago.');

      window.location.href = data.init_point;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: isMobile ? 2 : 4 }}>
        {/* Botón regresar */}
        <Box sx={{ maxWidth: isMobile ? '100%' : '900px', mx: 'auto', px: isMobile ? 2 : 0, mb: 2 }}>
          <Button
            onClick={() => navigate('/cliente/envios')}
            startIcon={<ArrowBackIosIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />}
            sx={{
              textTransform: 'none',
              color: 'primary.main',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'medium',
              pl: 1,
              py: 1,
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                borderRadius: 1,
              },
            }}
          >
            Regresar al envío
          </Button>
        </Box>

        {/* Contenedor principal */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 3,
            maxWidth: isMobile ? '100%' : '900px',
            mx: 'auto',
            px: isMobile ? 2 : 0,
          }}
        >
          {/* Sección de Pago con Mercado Pago */}
          <Paper
            elevation={4}
            sx={{
              flex: 1,
              p: isMobile ? 2.5 : 4,
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            }}
          >
            <Stack spacing={isMobile ? 2 : 3}>
              {/* Encabezado */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  fontWeight="bold"
                  color="primary.main"
                >
                  Pagar con Mercado Pago
                </Typography>
                <Box
                  component="img"
                  src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png"
                  alt="Mercado Pago"
                  sx={{ height: isMobile ? 36 : 48, objectFit: 'contain' }}
                />
              </Box>

              <Divider sx={{ borderColor: 'grey.300' }} />

              {/* Error */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    py: 1,
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Botón pagar */}
              <Box display="flex" justifyContent="center">
                <Button
                  onClick={pagarConMercadoPago}
                  disabled={total === 0 || carrito.length === 0 || loading}
                  variant="contained"
                  sx={{
                    bgcolor: '#00a2ed',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    px: isMobile ? 3 : 4,
                    py: isMobile ? 1 : 1.5,
                    borderRadius: 2,
                    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: '#0088cc',
                      boxShadow: '0 5px 12px rgba(0,0,0,0.3)',
                    },
                    '&:disabled': {
                      bgcolor: 'grey.400',
                      color: 'grey.700',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={isMobile ? 20 : 24} sx={{ color: '#fff' }} />
                  ) : (
                    'Pagar ahora'
                  )}
                </Button>
              </Box>

              {/* Seguridad */}
              <Box display="flex" justifyContent="center" alignItems="center">
                <SecurityIcon
                  fontSize={isMobile ? 'small' : 'medium'}
                  sx={{ mr: 1, color: 'text.secondary' }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Pago seguro con Mercado Pago
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Resumen del Pedido */}
          <Paper
            elevation={2}
            sx={{
              flex: 1,
              p: isMobile ? 2 : 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
              bgcolor: 'background.paper',
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h6'}
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, color: 'text.primary' }}
            >
              Resumen del Pedido
            </Typography>
            <Divider sx={{ my: isMobile ? 1.5 : 2, borderColor: 'grey.300' }} />
            <Box
              sx={{
                mb: isMobile ? 2 : 3,
                maxHeight: isMobile ? 180 : 300,
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': {
                  background: 'grey.400',
                  borderRadius: '3px',
                },
              }}
            >
              {carrito.map((item, i) => (
                <Box
                  key={item.producto_id ?? i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: isMobile ? 1 : 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      color: 'text.primary',
                      maxWidth: '60%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.nombre || item.nombre_producto || 'Producto'} x{item.cantidad_carrito}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: 'text.primary' }}
                  >
                    ${(parseFloat(item.precio_carrito) * parseInt(item.cantidad_carrito)).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: isMobile ? 1.5 : 2, borderColor: 'grey.300' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: 'text.secondary' }}
              >
                Subtotal ({carrito.length} producto{carrito.length !== 1 && 's'})
              </Typography>
              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: 'text.primary' }}
              >
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: 'text.secondary' }}
              >
                Envío
              </Typography>
              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: 'success.main' }}
              >
                Gratis
              </Typography>
            </Box>
            <Divider sx={{ my: isMobile ? 1.5 : 2, borderColor: 'grey.300' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                fontWeight="bold"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, color: 'text.primary' }}
              >
                Total
              </Typography>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h5'}
                fontWeight="bold"
                sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, color: 'primary.main' }}
              >
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
};

export default MercadoPago;

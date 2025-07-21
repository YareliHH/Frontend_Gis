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
    <>
      {/* Botón regresar */}
      <Box sx={{ maxWidth: '650px', mx: 'auto', mb: 2 }}>
        <Button
          onClick={() => navigate('/cliente/envios')}
          startIcon={<ArrowBackIosIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            textTransform: 'none',
            background: 'none',
            color: 'primary.main',
            fontSize: '1rem',
            pl: 0,
            '&:hover': { textDecoration: 'underline', background: 'none' },
          }}
        >
          Regresar al envío
        </Button>
      </Box>

      {/* Contenedor responsive: pago y resumen lado a lado en desktop */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 3,
          maxWidth: '950px',
          mx: 'auto',
        }}
      >
        {/* Bloque de “Pagar con Mercado Pago” (ahora primero) */}
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            p: 4,
            borderRadius: 3,
            bgcolor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
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

            {/* Botón pagar */}
            <Box display="flex" justifyContent="center">
              <Button
                onClick={pagarConMercadoPago}
                disabled={total === 0 || carrito.length === 0 || loading}
                sx={{
                  bgcolor: '#009ee3',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#007cb9' },
                  '&:disabled': { bgcolor: '#ccc' },
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

        {/* Resumen del Pedido (ahora segundo) */}
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Resumen del Pedido
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 3, maxHeight: 300, overflowY: 'auto' }}>
            {carrito.map((item, i) => (
              <Box
                key={item.producto_id ?? i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography variant="body2" noWrap>
                  {item.nombre || item.nombre_producto || 'Producto'} x{item.cantidad_carrito}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  ${(parseFloat(item.precio_carrito) * parseInt(item.cantidad_carrito)).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Subtotal ({carrito.length} producto{carrito.length !== 1 && 's'})
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              ${total.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">Envío</Typography>
            <Typography variant="body2" fontWeight="medium">
              Gratis
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              ${total.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default MercadoPago;

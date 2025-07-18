import React, { useState, useEffect } from 'react';
import {Container, Grid, Card, CardMedia, CardContent, Typography, TextField, Button, Collapse, Chip, Box,Stack, CircularProgress, InputAdornment, FormControl, InputLabel, Select, MenuItem, Tooltip} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Clear as ClearIcon, LocalOffer as OfferIcon, AccessTime as TimeIcon,} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ListaPromociones = () => {
  const navigate = useNavigate();
  const [promociones, setPromociones] = useState([]);
  const [promocionesFiltradas, setPromocionesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipo: '',
    descuentoMin: '',
    descuentoMax: '',
    stockMinimo: '',
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    obtenerPromociones();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, promociones]);

  const obtenerPromociones = async () => {
    try {
      const response = await fetch('https://backend-gis-1.onrender.com/api/promo/get');
      const data = await response.json();
      setPromociones(data);
      setPromocionesFiltradas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener promociones:', error);
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = promociones;

    if (filtros.busqueda) {
      resultado = resultado.filter(promo =>
        promo.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        promo.nombre_producto.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        promo.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase())
      );
    }

    if (filtros.tipo) {
      resultado = resultado.filter(promo => promo.tipo === filtros.tipo);
    }

    if (filtros.descuentoMin) {
      resultado = resultado.filter(promo => promo.descuento_calculado >= parseInt(filtros.descuentoMin));
    }

    if (filtros.descuentoMax) {
      resultado = resultado.filter(promo => promo.descuento_calculado <= parseInt(filtros.descuentoMax));
    }

    if (filtros.stockMinimo) {
      resultado = resultado.filter(promo => promo.stock >= parseInt(filtros.stockMinimo));
    }

    setPromocionesFiltradas(resultado);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const obtenerColorUrgencia = (dias) => {
    if (dias <= 3) return 'error';
    if (dias <= 7) return 'warning';
    return 'success';
  };

  const obtenerTiposUnicos = () => {
    return [...new Set(promociones.map(p => p.tipo).filter(Boolean))];
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      tipo: '',
      descuentoMin: '',
      descuentoMax: '',
      stockMinimo: '',
    });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Cargando promociones increíbles...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: { xs: '#fff', md: '#f5f5f5' }, py: 2 }}>
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: { xs: 4, md: 6 }, px: 2, mb: 4, textAlign: 'center', borderRadius: 3, boxShadow: 2, mx: { xs: 1, sm: 2, md: 'auto' }, maxWidth: 1300 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 28, md: 38 } }}>
          🎉 Promociones Increíbles
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.95, mb: 3, fontSize: { xs: 15, md: 18 } }}>
          Descubre las mejores ofertas con hasta 50% de descuento
        </Typography>
        <Stack direction="row" spacing={4} justifyContent="center" alignItems="center" flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <OfferIcon sx={{ fontSize: 22 }} />
            <Typography variant="body2">{promocionesFiltradas.length} promociones activas</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <TimeIcon sx={{ fontSize: 22 }} />
            <Typography variant="body2">Ofertas por tiempo limitado</Typography>
          </Box>
        </Stack>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ bgcolor: 'white', p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar promociones..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: '#f9f9f9', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<FilterIcon />}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                sx={{ py: 1.5, bgcolor: '#667eea', '&:hover': { bgcolor: '#5a6ed5' }, borderRadius: 2 }}
              >
                Filtros Avanzados
              </Button>
            </Grid>
          </Grid>

          <Collapse in={mostrarFiltros} sx={{ mt: 3 }}>
            <Box sx={{ pt: 3, borderTop: 1, borderColor: 'grey.300' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="primary">Filtros Avanzados</Typography>
                <Button onClick={limpiarFiltros} color="secondary" startIcon={<ClearIcon />}>Limpiar</Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={filtros.tipo}
                      label="Tipo"
                      onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                      sx={{ bgcolor: '#f9f9f9', borderRadius: 1 }}
                    >
                      <MenuItem value="">Todos los tipos</MenuItem>
                      {obtenerTiposUnicos().map(tipo => (
                        <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Descuento mínimo (%)"
                    type="number"
                    value={filtros.descuentoMin}
                    onChange={(e) => setFiltros({ ...filtros, descuentoMin: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    sx={{ bgcolor: '#f9f9f9', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Descuento máximo (%)"
                    type="number"
                    value={filtros.descuentoMax}
                    onChange={(e) => setFiltros({ ...filtros, descuentoMax: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">%</InputAdornment>,
                    }}
                    sx={{ bgcolor: '#f9f9f9', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Stock mínimo"
                    type="number"
                    value={filtros.stockMinimo}
                    onChange={(e) => setFiltros({ ...filtros, stockMinimo: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">#</InputAdornment>,
                    }}
                    sx={{ bgcolor: '#f9f9f9', borderRadius: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Box>

        {promocionesFiltradas.length === 0 ? (
          <Box sx={{ bgcolor: 'white', p: 6, borderRadius: 3, boxShadow: 1, textAlign: 'center' }}>
            <Typography variant="h4" color="text.secondary" gutterBottom>
              🔍 No se encontraron promociones
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Intenta ajustar los filtros o busca algo diferente.
            </Typography>
            <Button onClick={limpiarFiltros} variant="contained" color="primary" startIcon={<ClearIcon />}>
              Limpiar Filtros
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {promocionesFiltradas.map((promo) => (
              <Grid item xs={12} sm={6} md={4} key={promo.id_promocion}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.02)',
                      boxShadow: 8,
                    },
                  }}
                >
                  {promo.descuento_calculado > 0 && (
                    <Chip
                      label={`-${Math.round(promo.descuento_calculado)}%`}
                      color="error"
                      sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 'bold', zIndex: 1 }}
                    />
                  )}
                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 1, overflowX: 'auto', p: 1, borderRadius: '12px 12px 0 0', bgcolor: '#f7f9fc', minHeight: { xs: 120, sm: 180 }, mb: 1 }}>
                    {(promo.imagenes && promo.imagenes.length > 0)
                      ? promo.imagenes.map((img, idx) => (
                        <img
                          key={img.id || idx}
                          src={img.url}
                          alt={promo.titulo}
                          style={{ height: 130, width: 180, objectFit: 'cover', borderRadius: 12, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        />
                      ))
                      : (
                        <img
                          src={'https://via.placeholder.com/400x240?text=Sin+Imagen'}
                          alt={promo.titulo}
                          style={{ height: 130, width: 180, objectFit: 'cover', borderRadius: 12 }}
                        />
                      )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Tooltip title={promo.titulo} arrow>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {promo.titulo}
                      </Typography>
                    </Tooltip>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '40px' }}>
                      {promo.descripcion}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'medium', mb: 1 }}>
                      {promo.nombre_producto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Stock: {promo.stock} unidades
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', mb: 0.5 }}>
                        Precio original: {formatearPrecio(promo.precio_original)}
                      </Typography>
                      <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {formatearPrecio(promo.precio_nuevo || 0)}
                      </Typography>
                      {promo.ahorro_total > 0 && (
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                          Ahorras: {formatearPrecio(promo.ahorro_total)}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Chip icon={<OfferIcon />} label={promo.tipo} size="small" color="primary" variant="outlined" />
                      {promo.dias_restantes !== null && (
                        <Chip icon={<TimeIcon />} label={`${promo.dias_restantes} días`} size="small" color={obtenerColorUrgencia(promo.dias_restantes)} variant="outlined" />
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      Válido desde: {formatearFecha(promo.fecha_inicio)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                      Válido hasta: {formatearFecha(promo.fecha_fin)}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate('/cliente/carrito')}
                        sx={{ py: 1.2, fontWeight: 700, borderRadius: 2 }}
                      >
                        Agregar al carrito
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ListaPromociones;

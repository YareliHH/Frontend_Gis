import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  CircularProgress,
  Avatar,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stack,
  CardMedia,
  DialogContentText
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Visibility,
  Close,
  LocalOffer,
  TrendingUp,
  Schedule,
  Inventory,
  Percent,
  AttachMoney,
  Star,
  Clear,
  ShoppingCart,
  CalendarToday,
  Warning,
  CalendarToday as Calendar
} from '@mui/icons-material';

const Promociones = () => {
  // Estados principales
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [editId, setEditId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openEditConfirm, setOpenEditConfirm] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    id_producto: '',
    titulo: '',
    descripcion: '',
    tipo: '',
    valor_descuento: '',
    porcentaje_descuento: '',
    fecha_inicio: '',
    fecha_fin: '',
    duracion: '',
    estado: 'activo'
  });

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    tipo: '',
    vigencia: ''
  });

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [errors, setErrors] = useState({});

  // Función para obtener promociones desde la API
  const fetchPromociones = async () => {
    setLoadingData(true);
    try {
      const response = await fetch('http://localhost:3001/api/promo/get_promo');
      const data = await response.json();
      setPromociones(data);
    } catch (err) {
      showNotification('Error al cargar promociones', 'error');
      console.error('Error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Función para obtener productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/obtener');
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      showNotification('Error al cargar productos', 'error');
    }
  };

  const duracionOpciones = [
    { value: '1', label: '1 día' },
    { value: '2', label: '2 días' },
    { value: '3', label: '3 días' },
    { value: '7', label: '1 semana' },
    { value: '15', label: '15 días' },
    { value: '30', label: '1 mes' },
    { value: '60', label: '2 meses' },
    { value: '90', label: '3 meses' }
  ];

  // Función para calcular fecha fin basada en fecha inicio y duración
  const calcularFechaFin = (fechaInicio, dias) => {
    if (!fechaInicio || !dias) return '';
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + parseInt(dias));
    return fecha.toISOString().split('T')[0];
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id_producto) {
      newErrors.id_producto = 'Debe seleccionar un producto';
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (formData.titulo.length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres';
    } else if (formData.titulo.length > 100) {
      newErrors.titulo = 'El título no puede exceder 100 caracteres';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'Debe seleccionar un tipo de promoción';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
    } else {
      const fechaInicio = new Date(formData.fecha_inicio);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaInicio < hoy) {
        newErrors.fecha_inicio = 'La fecha de inicio no puede ser anterior a hoy';
      }
    }

    if (!formData.duracion) {
      newErrors.duracion = 'Debe seleccionar la duración de la promoción';
    }

    if (!formData.estado) {
      newErrors.estado = 'Debe seleccionar un estado';
    }

    if (formData.tipo.toLowerCase() === 'descuento') {
      const tieneValorFijo = formData.valor_descuento && parseFloat(formData.valor_descuento) > 0;
      const tienePorcentaje = formData.porcentaje_descuento && parseFloat(formData.porcentaje_descuento) > 0;

      if (!tieneValorFijo && !tienePorcentaje) {
        newErrors.valor_descuento = 'Debe especificar un porcentaje O un valor fijo de descuento';
        newErrors.porcentaje_descuento = 'Debe especificar un porcentaje O un valor fijo de descuento';
      }

      if (formData.porcentaje_descuento) {
        const porcentaje = parseFloat(formData.porcentaje_descuento);
        if (porcentaje <= 0) {
          newErrors.porcentaje_descuento = 'El porcentaje debe ser mayor a 0';
        } else if (porcentaje > 100) {
          newErrors.porcentaje_descuento = 'El porcentaje no puede ser mayor a 100';
        }
      }

      if (formData.valor_descuento) {
        const valor = parseFloat(formData.valor_descuento);
        if (valor <= 0) {
          newErrors.valor_descuento = 'El valor debe ser mayor a 0';
        }

        const producto = productos.find(p => p.id === parseInt(formData.id_producto));
        if (producto && valor >= parseFloat(producto.precio)) {
          newErrors.valor_descuento = `El descuento no puede ser mayor o igual al precio del producto (${formatCurrency(producto.precio)})`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePrices = (producto, promo) => {
    if (!producto || !promo) return null;

    const precioOriginal = parseFloat(producto.precio || 0);
    let precioFinal = precioOriginal;
    let descuento = 0;
    let porcentajeDescuento = 0;

    if (promo.tipo.toLowerCase() === 'descuento') {
      if (promo.porcentaje_descuento && promo.porcentaje_descuento > 0) {
        porcentajeDescuento = parseFloat(promo.porcentaje_descuento);
        descuento = precioOriginal * (porcentajeDescuento / 100);
      } else if (promo.valor_descuento && promo.valor_descuento > 0) {
        descuento = parseFloat(promo.valor_descuento);
        porcentajeDescuento = precioOriginal > 0 ? (descuento / precioOriginal) * 100 : 0;
      }
      precioFinal = Math.max(0, precioOriginal - descuento);
    } else if (promo.tipo === '2x1') {
      porcentajeDescuento = 50;
      descuento = precioOriginal;
      precioFinal = precioOriginal;
    }

    return {
      original: precioOriginal,
      descuento: descuento,
      final: precioFinal,
      porcentajeDescuento: porcentajeDescuento,
      precioTotal2x1: promo.tipo === '2x1' ? precioOriginal : null,
      valorReal2x1: promo.tipo === '2x1' ? precioOriginal * 2 : null,
      precioPorUnidad2x1: promo.tipo === '2x1' ? precioOriginal / 2 : null
    };
  };

  const getVigenciaStatus = (fechaInicio, fechaFin) => {
    const hoy = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (hoy < inicio) return { status: 'proxima', color: 'info', label: 'Próxima' };
    if (hoy > fin) return { status: 'vencida', color: 'error', label: 'Vencida' };
    return { status: 'activa', color: 'success', label: 'Activa' };
  };

  const getPromocionesStats = () => {
    const activas = promociones.filter(p =>
      getVigenciaStatus(p.fecha_inicio, p.fecha_fin).status === 'activa'
    ).length;
    const proximas = promociones.filter(p =>
      getVigenciaStatus(p.fecha_inicio, p.fecha_fin).status === 'proxima'
    ).length;
    const vencidas = promociones.filter(p =>
      getVigenciaStatus(p.fecha_inicio, p.fecha_fin).status === 'vencida'
    ).length;

    return { activas, proximas, vencidas, total: promociones.length };
  };

  const filteredPromociones = promociones.filter(promo => {
    const producto = productos.find(p => p.id === promo.id_producto);
    const vigencia = getVigenciaStatus(promo.fecha_inicio, promo.fecha_fin);

    if (filters.search &&
      !promo.titulo.toLowerCase().includes(filters.search.toLowerCase()) &&
      !producto?.nombre_producto.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (filters.estado && promo.estado !== filters.estado) return false;
    if (filters.tipo && promo.tipo.toLowerCase() !== filters.tipo.toLowerCase()) return false;
    if (filters.vigencia && vigencia.status !== filters.vigencia) return false;

    return true;
  });

  useEffect(() => {
    fetchPromociones();
    fetchProductos();
  }, []);

  const handleOpenForm = (promo = null) => {
    if (promo) {
      let duracionCalculada = '';
      if (promo.fecha_inicio && promo.fecha_fin) {
        const inicio = new Date(promo.fecha_inicio);
        const fin = new Date(promo.fecha_fin);
        const diffTime = Math.abs(fin - inicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const duracionEncontrada = duracionOpciones.find(opt => parseInt(opt.value) === diffDays);
        duracionCalculada = duracionEncontrada ? duracionEncontrada.value : diffDays.toString();
      }

      setFormData({
        id_producto: promo.id_producto || '',
        titulo: promo.titulo || '',
        descripcion: promo.descripcion || '',
        tipo: promo.tipo || '',
        valor_descuento: promo.valor_descuento || '',
        porcentaje_descuento: promo.porcentaje_descuento || '',
        fecha_inicio: promo.fecha_inicio ? promo.fecha_inicio.split('T')[0] : '',
        fecha_fin: promo.fecha_fin ? promo.fecha_fin.split('T')[0] : '',
        duracion: duracionCalculada,
        estado: promo.estado || 'activo'
      });
      setEditId(promo.id_promocion);
    } else {
      setFormData({
        id_producto: '',
        titulo: '',
        descripcion: '',
        tipo: '',
        valor_descuento: '',
        porcentaje_descuento: '',
        fecha_inicio: '',
        fecha_fin: '',
        duracion: '',
        estado: 'activo'
      });
      setEditId(null);
    }
    setErrors({});
    setOpenForm(true);
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      if (field === 'fecha_inicio' || field === 'duracion') {
        const fechaInicio = field === 'fecha_inicio' ? value : prev.fecha_inicio;
        const duracion = field === 'duracion' ? value : prev.duracion;

        if (fechaInicio && duracion) {
          newData.fecha_fin = calcularFechaFin(fechaInicio, duracion);
        }
      }

      return newData;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'porcentaje_descuento' && value) {
      setFormData(prev => ({ ...prev, valor_descuento: '' }));
      if (errors.valor_descuento) {
        setErrors(prev => ({ ...prev, valor_descuento: '' }));
      }
    }

    if (field === 'valor_descuento' && value) {
      setFormData(prev => ({ ...prev, porcentaje_descuento: '' }));
      if (errors.porcentaje_descuento) {
        setErrors(prev => ({ ...prev, porcentaje_descuento: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Por favor corrija los errores en el formulario', 'warning');
      return;
    }

    setLoading(true);
    try {
      const options = {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      };

      const url = editId
        ? `http://localhost:3001/api/promo/update/${editId}`
        : 'http://localhost:3001/api/promo/create';

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showNotification(
        editId ? 'Promoción actualizada correctamente' : 'Promoción creada correctamente',
        'success'
      );
      setOpenForm(false);
      setOpenEditConfirm(false);
      fetchPromociones();
    } catch (err) {
      console.error('Error:', err);
      showNotification(`Error al ${editId ? 'actualizar' : 'crear'} la promoción`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/promo/delete/${deleteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showNotification('Promoción eliminada correctamente', 'info');
      setOpenDeleteConfirm(false);
      setDeleteId(null);
      fetchPromociones();
    } catch (err) {
      console.error('Error:', err);
      showNotification('Error al eliminar la promoción', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmEdit = () => {
    setOpenEditConfirm(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  };

  const getProductoInfo = (idProducto) => {
    return productos.find(p => p.id === parseInt(idProducto));
  };

  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'success';
      case 'inactivo': return 'error';
      case 'pausado': return 'warning';
      default: return 'default';
    }
  };

  const stats = getPromocionesStats();

  const statsConfig = [
    { title: 'Activas', value: stats.activas, icon: TrendingUp, color: 'success.main' },
    { title: 'Próximas', value: stats.proximas, icon: Schedule, color: 'info.main' },
    { title: 'Vencidas', value: stats.vencidas, icon: Inventory, color: 'error.main' },
    { title: 'Total', value: stats.total, icon: LocalOffer, color: 'primary.main' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Gestión de Promociones
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra promociones y ofertas especiales
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
          disabled={loading}
          size="large"
          sx={{ borderRadius: 3, px: 4 }}
        >
          Nueva Promoción
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsConfig.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Grid item xs={6} md={3} key={stat.title}>
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <IconComponent sx={{ fontSize: 40, color: stat.color }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar promoción o producto..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: filters.search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.estado}
                onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
                label="Estado"
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
                <MenuItem value="pausado">Pausado</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.tipo}
                onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
                label="Tipo"
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="descuento">Descuento</MenuItem>
                <MenuItem value="2x1">2x1</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Vigencia</InputLabel>
              <Select
                value={filters.vigencia}
                onChange={(e) => setFilters(prev => ({ ...prev, vigencia: e.target.value }))}
                label="Vigencia"
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="activa">Activas</MenuItem>
                <MenuItem value="proxima">Próximas</MenuItem>
                <MenuItem value="vencida">Vencidas</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilters({ search: '', estado: '', tipo: '', vigencia: '' })}
              sx={{ borderRadius: 3 }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell><Typography fontWeight={600}>Promoción</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Producto</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Tipo</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Descuento</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Vigencia</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Estado</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={600}>Acciones</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingData ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : filteredPromociones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" variant="h6">
                      No se encontraron promociones
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPromociones.map((promo) => {
                  const producto = getProductoInfo(promo.id_producto);
                  const vigencia = getVigenciaStatus(promo.fecha_inicio, promo.fecha_fin);
                  const precios = calculatePrices(producto, promo);

                  return (
                    <TableRow key={promo.id_promocion} hover sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {promo.titulo}
                        </Typography>
                        {promo.descripcion && (
                          <Typography variant="body2" color="text.secondary">
                            {promo.descripcion}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={producto?.imagen}
                            sx={{ width: 48, height: 48, mr: 2, borderRadius: 2 }}
                          >
                            <Inventory />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {producto?.nombre_producto || 'Producto no encontrado'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatCurrency(producto?.precio)} • Stock: {producto?.stock}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={promo.tipo === '2x1' ? <Star /> : <Percent />}
                          label={promo.tipo === '2x1' ? '2x1' : 'Descuento'}
                          size="small"
                          color={promo.tipo === '2x1' ? 'secondary' : 'primary'}
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>

                      <TableCell>
                        {precios ? (
                          <Box>
                            <Typography variant="body2" fontWeight={600} color="error.main">
                              {Math.round(precios.porcentajeDescuento)}% OFF
                            </Typography>
                            {promo.tipo === '2x1' ? (
                              <Typography variant="caption" color="text.secondary">
                                Pagas: {formatCurrency(precios.precioTotal2x1)}
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                Final: {formatCurrency(precios.final)}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDate(promo.fecha_inicio)} - {formatDate(promo.fecha_fin)}
                        </Typography>
                        <Chip
                          label={vigencia.label}
                          color={vigencia.color}
                          size="small"
                          sx={{ mt: 1, borderRadius: 2 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={promo.estado}
                          color={getStatusColor(promo.estado)}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'capitalize', borderRadius: 2 }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Ver detalles">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedPromo(promo);
                                setOpenDetails(true);
                              }}
                              sx={{ color: 'grey.600' }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenForm(promo)}
                              disabled={loading}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => confirmDelete(promo.id_promocion)}
                              disabled={loading}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog de formulario */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {editId ? 'Editar Promoción' : 'Nueva Promoción'}
            </Typography>
            <IconButton onClick={() => setOpenForm(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.id_producto}>
                <InputLabel>Producto</InputLabel>
                <Select
                  name="id_producto"
                  value={formData.id_producto}
                  onChange={(e) => handleChange('id_producto', e.target.value)}
                  label="Producto"
                  sx={{ borderRadius: 2 }}
                >
                  {productos.map(producto => (
                    <MenuItem key={producto.id} value={producto.id}>
                      <Box display="flex" alignItems="center">
                        <Avatar src={producto.imagen} sx={{ width: 32, height: 32, mr: 1 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{producto.nombre_producto}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(producto.precio)}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.id_producto && <FormHelperText>{errors.id_producto}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                error={!!errors.titulo}
                helperText={errors.titulo}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                multiline
                rows={3}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth required error={!!errors.tipo}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={(e) => handleChange('tipo', e.target.value)}
                  label="Tipo"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="descuento">
                    <Box display="flex" alignItems="center">
                      <Percent sx={{ mr: 1, color: 'primary.main' }} />
                      Descuento
                    </Box>
                  </MenuItem>
                  <MenuItem value="2x1">
                    <Box display="flex" alignItems="center">
                      <Star sx={{ mr: 1, color: 'secondary.main' }} />
                      2x1
                    </Box>
                  </MenuItem>
                </Select>
                {errors.tipo && <FormHelperText>{errors.tipo}</FormHelperText>}
              </FormControl>
            </Grid>

            {formData.tipo === 'descuento' && (
              <>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Porcentaje"
                    name="porcentaje_descuento"
                    value={formData.porcentaje_descuento}
                    onChange={(e) => handleChange('porcentaje_descuento', e.target.value)}
                    error={!!errors.porcentaje_descuento}
                    helperText={errors.porcentaje_descuento || "Ej: 12 para 12%"}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Percent /></InputAdornment>,
                      inputProps: { min: 0, max: 100, step: 0.01 }
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cantidad fija"
                    name="valor_descuento"
                    value={formData.valor_descuento}
                    onChange={(e) => handleChange('valor_descuento', e.target.value)}
                    error={!!errors.valor_descuento}
                    helperText={errors.valor_descuento || "O cantidad fija: $50"}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment>,
                      inputProps: { min: 0, step: 0.01 }
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} md={formData.tipo === 'descuento' ? 12 : 8}>
              <FormControl fullWidth required error={!!errors.estado}>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  label="Estado"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="pausado">Pausado</MenuItem>
                </Select>
                {errors.estado && <FormHelperText>{errors.estado}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Fecha de inicio"
                name="fecha_inicio"
                InputLabelProps={{ shrink: true }}
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                error={!!errors.fecha_inicio}
                helperText={errors.fecha_inicio}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.duracion}>
                <InputLabel>Duración</InputLabel>
                <Select
                  name="duracion"
                  value={formData.duracion}
                  onChange={(e) => handleChange('duracion', e.target.value)}
                  label="Duración"
                  sx={{ borderRadius: 2 }}
                >
                  {duracionOpciones.map(opcion => (
                    <MenuItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.duracion && <FormHelperText>{errors.duracion}</FormHelperText>}
              </FormControl>
            </Grid>

            {formData.fecha_fin && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'info.light',
                    borderRadius: 2,
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    La promoción finalizará el: {formatDate(formData.fecha_fin)}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenForm(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={editId ? confirmEdit : handleSubmit}
            disabled={loading}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {editId ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de detalles mejorado */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, minHeight: '75vh' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>Detalles de Promoción</Typography>
            <IconButton onClick={() => setOpenDetails(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 1 }}>
          {selectedPromo && (
            <Box>
              {/* Header */}
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {selectedPromo.titulo}
                </Typography>
                {selectedPromo.descripcion && (
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    {selectedPromo.descripcion}
                  </Typography>
                )}
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label={selectedPromo.tipo === '2x1' ? '2x1' : 'Descuento'}
                    color="secondary"
                    size="small"
                    icon={selectedPromo.tipo === '2x1' ? <Star /> : <Percent />}
                  />
                  <Chip
                    label={selectedPromo.estado}
                    color={getStatusColor(selectedPromo.estado)}
                    size="small"
                  />
                  {(() => {
                    const vigencia = getVigenciaStatus(selectedPromo.fecha_inicio, selectedPromo.fecha_fin);
                    return (
                      <Chip
                        label={vigencia.label}
                        color={vigencia.color}
                        size="small"
                      />
                    );
                  })()}
                </Box>
              </Box>

              <Box sx={{ p: 2 }}>
                {(() => {
                  const producto = getProductoInfo(selectedPromo.id_producto);
                  const precios = calculatePrices(producto, selectedPromo);
                  const vigencia = getVigenciaStatus(selectedPromo.fecha_inicio, selectedPromo.fecha_fin);

                  return (
                    <Grid container spacing={2}>
                      {/* Producto */}
                      <Grid item xs={12} lg={5}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Producto Promocionado
                        </Typography>

                        {producto ? (
                          <Card elevation={2} sx={{ borderRadius: 2 }}>
                            <CardMedia
                              component="img"
                              height="auto"
                              image={producto.imagen}
                              alt={producto.nombre_producto}
                              sx={{
                                objectFit: 'cover',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.03)'
                                }
                              }}
                            />
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {producto.nombre_producto}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {producto.descripcion || 'Producto de buena calidad'}
                              </Typography>

                              <Grid container spacing={1}>
                                {[
                                  { label: 'Categoría', value: producto.categoria },
                                  { label: 'Color', value: producto.color },
                                  { label: 'Talla', value: producto.talla },
                                  { label: 'Stock', value: `${producto.stock} unidades` }
                                ].map((item, idx) => (
                                  <Grid item xs={6} key={idx}>
                                    <Paper elevation={1} sx={{ p: 1.2, borderRadius: 2, textAlign: 'center' }}>
                                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                                      <Typography variant="body2" fontWeight={500}>{item.value}</Typography>
                                    </Paper>
                                  </Grid>
                                ))}
                              </Grid>
                            </CardContent>
                          </Card>
                        ) : (
                          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                            <Typography color="text.secondary">Producto no encontrado</Typography>
                          </Paper>
                        )}
                      </Grid>

                      {/* Info de promoción */}
                      <Grid item xs={12} lg={7}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Análisis de la Promoción
                        </Typography>

                        <Stack spacing={2}>
                          {/* Precio original */}
                          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Box display="flex" alignItems="center">
                                <ShoppingCart sx={{ mr: 1, color: 'text.secondary' }} />
                                <Box>
                                  <Typography variant="body1" fontWeight={600}>
                                    Precio Original
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Precio base del producto
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="h6" fontWeight={700}>
                                {formatCurrency(producto?.precio)}
                              </Typography>
                            </Box>
                          </Paper>

                          {/* Descuento aplicado */}
                          {precios && (
                            <Paper
                              elevation={1}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: selectedPromo.tipo === '2x1' ? 'secondary.light' : 'error.light',
                                color: 'white'
                              }}
                            >
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <Box display="flex" alignItems="center">
                                  {selectedPromo.tipo === '2x1'
                                    ? <Star sx={{ mr: 1 }} />
                                    : <Percent sx={{ mr: 1 }} />}
                                  <Box>
                                    <Typography variant="body1" fontWeight={600}>
                                      {selectedPromo.tipo === '2x1' ? 'Oferta 2x1' : 'Descuento Aplicado'}
                                    </Typography>
                                    <Typography variant="caption">
                                      {selectedPromo.tipo === '2x1'
                                        ? 'Llevas 2 por 1'
                                        : `Descuento del ${Math.round(precios.porcentajeDescuento)}%`}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography variant="h6" fontWeight={700}>
                                  {Math.round(precios.porcentajeDescuento)}% OFF
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Ahorras: {formatCurrency(precios.descuento)}
                              </Typography>
                              {selectedPromo.tipo === '2x1' && (
                                <Typography variant="caption">
                                  Valor real de 2 productos: {formatCurrency(precios.valorReal2x1)}
                                </Typography>
                              )}
                            </Paper>
                          )}

                          {/* Precio final */}
                          {precios && (
                            <Paper
                              elevation={1}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'success.light',
                                color: 'white'
                              }}
                            >
                              <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                  <AttachMoney sx={{ mr: 1 }} />
                                  <Box>
                                    <Typography variant="body1" fontWeight={600}>
                                      {selectedPromo.tipo === '2x1' ? 'Total a Pagar' : 'Precio Final'}
                                    </Typography>
                                    <Typography variant="caption">
                                      {selectedPromo.tipo === '2x1'
                                        ? 'Por 2 productos'
                                        : 'Con descuento aplicado'}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography variant="h5" fontWeight={700}>
                                  {selectedPromo.tipo === '2x1'
                                    ? formatCurrency(precios.precioTotal2x1)
                                    : formatCurrency(precios.final)}
                                </Typography>
                              </Box>
                              {selectedPromo.tipo === '2x1' && (
                                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                  Precio por unidad: {formatCurrency(precios.precioPorUnidad2x1)}
                                </Typography>
                              )}
                            </Paper>
                          )}

                          {/* Vigencia */}
                          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                              <Box display="flex" alignItems="center">
                                <Calendar sx={{ mr: 1, color: 'text.secondary' }} />
                                <Box>
                                  <Typography variant="body1" fontWeight={600}>
                                    Período de Vigencia
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Duración
                                  </Typography>
                                </Box>
                              </Box>
                              <Chip
                                label={vigencia.label}
                                color={vigencia.color}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                            <Typography variant="body2" fontWeight={600}>
                              Del {formatDate(selectedPromo.fecha_inicio)} al {formatDate(selectedPromo.fecha_fin)}
                            </Typography>
                            {(() => {
                              const hoy = new Date();
                              const fin = new Date(selectedPromo.fecha_fin);
                              const diffTime = fin - hoy;
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                              return diffDays > 0 ? (
                                <Typography variant="caption" color="text.secondary">
                                  Quedan {diffDays} día{diffDays > 1 ? 's' : ''}
                                </Typography>
                              ) : null;
                            })()}
                          </Paper>
                          {/* Explicación adicional para 2x1 */}
                          {selectedPromo.tipo === '2x1' && precios && (
                            <Paper
                              elevation={2}
                              sx={{
                                p: 3,
                                borderRadius: 3,
                                bgcolor: 'info.light',
                                color: 'white'
                              }}
                            >
                              <Typography variant="h6" fontWeight={600} gutterBottom>
                                ¿Cómo funciona esta promoción?
                              </Typography>
                              <Box component="ul" sx={{ pl: 2 }}>
                                <Typography component="li" variant="body1" gutterBottom>
                                  El cliente paga: {formatCurrency(precios.precioTotal2x1)}
                                </Typography>
                                <Typography component="li" variant="body1" gutterBottom>
                                  Se lleva: 2 productos idénticos
                                </Typography>
                                <Typography component="li" variant="body1" gutterBottom>
                                  Valor real total: {formatCurrency(precios.valorReal2x1)}
                                </Typography>
                                <Typography component="li" variant="body1">
                                  Ahorro total: {formatCurrency(precios.descuento)}
                                </Typography>
                              </Box>
                            </Paper>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  );
                })()}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDetails(false)} sx={{ borderRadius: 2 }} size="small">
            Cerrar
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => {
              setOpenDetails(false);
              handleOpenForm(selectedPromo);
            }}
            sx={{ borderRadius: 2 }}
            size="small"
          >
            Editar Promoción
          </Button>
        </DialogActions>
      </Dialog>


      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Warning sx={{ mr: 2, color: 'error.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Confirmar eliminación
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar esta promoción? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDeleteConfirm(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de edición */}
      <Dialog
        open={openEditConfirm}
        onClose={() => setOpenEditConfirm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Edit sx={{ mr: 2, color: 'warning.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Confirmar actualización
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea actualizar esta promoción con los nuevos datos?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenEditConfirm(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificación */}
      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={() => setNotification({ show: false, message: '', type: 'success' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: 'success' })}
          sx={{ borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Loading backdrop */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1">Procesando...</Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Promociones;
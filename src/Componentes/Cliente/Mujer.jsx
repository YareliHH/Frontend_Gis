import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CardMedia, CardContent, CardActions, IconButton, Chip, Container, Divider, TextField, InputAdornment, useMediaQuery, Skeleton, Fab, Drawer, Button, Stack, Alert, CircularProgress, Paper, alpha } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon, Search as SearchIcon, FilterList as FilterListIcon, Close as CloseIcon, Visibility as VisibilityIcon, Category as CategoryIcon, ColorLens as ColorLensIcon, Straighten as StraightenIcon, Sort as SortIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return { data: null, error: error.message || 'Error al cargar datos' };
  }
};

const Mujer = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [catalogosLoading, setCatalogosLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [tallaFilter, setTallaFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOrder, setSortOrder] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';

  const customColors = {
    primary: '#8857e0',
    secondary: '#b253d8',
    accent: '#e252b2',
    lightAccent: '#f579d2',
    rose: '#ff6ec4',
    background: isDarkMode ? '#121212' : '#f9f5ff',
    cardBg: isDarkMode ? '#1e1e2d' : '#ffffff',
    textPrimary: isDarkMode ? '#ffffff' : '#2c2c54',
    textSecondary: isDarkMode ? '#b3b3cc' : '#4b4b80',
    gradient: 'linear-gradient(135deg, #8857e0 0%, #ff6ec4 100%)'
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [productosResult, categoriasResult, coloresResult, tallasResult] = await Promise.all([
        fetchData('http://localhost:3001/api/Mujeres'),
        fetchData('http://localhost:3001/api/categorias'),
        fetchData('http://localhost:3001/api/colores'),
        fetchData('http://localhost:3001/api/tallas')
      ]);

      if (productosResult.error) {
        setError('Error al cargar productos: ' + productosResult.error);
        setLoading(false);
        return;
      }

      setProducts(productosResult.data);
      setFilteredProducts(productosResult.data);
      setCategorias(categoriasResult.data || []);
      setColores(coloresResult.data || []);
      setTallas(tallasResult.data || []);
      setCatalogosLoading(false);
      setLoading(false);
    };
    loadData();
  }, []);

  const getCategoryName = React.useCallback((id) => categorias.find(c => c.id_categoria === id)?.nombre || 'Categoría N/A', [categorias]);
  const getColorName = React.useCallback((id) => colores.find(c => c.id === id)?.color || 'Color N/A', [colores]);
  const getColorCode = (color) => ({
    'Rojo': '#e74c3c',
    'Blanco': '#ffffff',
    'Azul': '#3a36e0',
    'Celeste': '#81d4fa',
    'Amarillo': '#f1c40f',
    'Rojo Coral': '#ff4040',
    'Azul Marino': '#2c3e88',
    'Negro': '#2c2c54',
    'Verde': '#2ecc71',
    'Gris': '#7f8c8d',
    'Morado': '#9b59b6',
    'Rosa': '#e252b2',
    'Naranja': '#e67e22',
    'Café': '#795548',
    'Beige': '#f5f5dc'
  }[color] || '#cccccc');
  const getSizeName = React.useCallback((id) => tallas.find(t => t.id === id)?.talla || 'Talla N/A', [tallas]);
  const getStockStatus = (stock) => stock > 5 ? { text: 'En Stock', color: 'success' } : stock > 0 ? { text: `Últimas ${stock} piezas`, color: 'warning' } : { text: 'Agotado', color: 'error' };

  useEffect(() => {
    let result = [...products];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.nombre_producto?.toLowerCase().includes(term) ||
        p.descripcion?.toLowerCase().includes(term) ||
        getColorName(p.id_color)?.toLowerCase().includes(term) ||
        getCategoryName(p.id_categoria)?.toLowerCase().includes(term) ||
        getSizeName(p.id_talla)?.toLowerCase().includes(term)
      );
    }
    if (colorFilter) result = result.filter(p => p.id_color === parseInt(colorFilter));
    if (tallaFilter) result = result.filter(p => p.id_talla === parseInt(tallaFilter));
    if (categoriaFilter) result = result.filter(p => p.id_categoria === parseInt(categoriaFilter));
    result = result.filter(p => parseFloat(p.precio) >= priceRange[0] && parseFloat(p.precio) <= priceRange[1]);
    if (sortOrder) {
      result.sort((a, b) => 
        sortOrder === 'price-asc' ? parseFloat(a.precio) - parseFloat(b.precio) :
        sortOrder === 'price-desc' ? parseFloat(b.precio) - parseFloat(a.precio) :
        sortOrder === 'name-asc' ? a.nombre_producto.localeCompare(b.nombre_producto) :
        sortOrder === 'name-desc' ? b.nombre_producto.localeCompare(a.nombre_producto) :
        b.stock - a.stock
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, colorFilter, tallaFilter, categoriaFilter, priceRange, sortOrder, products, getCategoryName, getColorName, getSizeName]);

  const handleProductClick = (product) => {
    navigate(`/cliente/detallesp/${product.id}`, { 
      state: { 
        from: 'mujeres',
        productName: product.nombre_producto 
      } 
    });
  };

  const resetFilters = () => { 
    setSearchTerm(''); 
    setColorFilter(''); 
    setTallaFilter(''); 
    setCategoriaFilter(''); 
    setPriceRange([0, 1000]); 
    setSortOrder(''); 
    setDrawerOpen(false); 
  };

  const ProductCard = ({ product, loading }) => {
    if (loading) return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper elevation={2} sx={{ height: '100%', borderRadius: '16px', overflow: 'hidden', backgroundColor: customColors.cardBg }}>
          <Skeleton variant="rectangular" height={240} />
          <Box sx={{ p: 2 }}><Skeleton variant="text" height={30} /><Skeleton variant="text" /><Skeleton variant="text" width="60%" /></Box>
        </Paper>
      </motion.div>
    );

    const { text: stockText, color: stockColor } = getStockStatus(product.stock);
    const colorName = !catalogosLoading ? getColorName(product.id_color) : 'Cargando...';
    const categoryName = !catalogosLoading ? getCategoryName(product.id_categoria) : 'Cargando...';
    const colorCode = getColorCode(colorName);

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ y: -10 }}>
        <Paper elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', backgroundColor: customColors.cardBg, transition: 'all 0.3s ease', '&:hover': { boxShadow: `0 10px 20px ${alpha(customColors.primary, 0.15)}` }}}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia 
              component="img" 
              height="240" 
              image={product.url || '/placeholder-image.jpg'} 
              alt={product.nombre_producto} 
              sx={{ objectFit: 'contain', pt: 2, cursor: 'pointer', transition: 'transform 0.6s ease', '&:hover': { transform: 'scale(1.05)' }}} 
              onClick={() => handleProductClick(product)} 
            />
            <Chip label={stockText} color={stockColor} size="small" sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 'bold', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <Chip label={colorName} size="small" sx={{ position: 'absolute', top: 12, right: 12, backgroundColor: colorCode, color: ['Blanco', 'Amarillo', 'Celeste', 'Beige'].includes(colorName) ? '#000000' : '#ffffff', fontWeight: 'bold', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          </Box>
          <CardContent sx={{ flexGrow: 1, px: 3, pt: 2 }}>
            <Typography 
              variant="h6" 
              onClick={() => handleProductClick(product)} 
              sx={{ fontWeight: 600, mb: 1.5, cursor: 'pointer', color: customColors.textPrimary, '&:hover': { color: customColors.accent }, transition: 'color 0.3s ease', fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              {product.nombre_producto}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', color: customColors.textSecondary }}>
              {product.descripcion}
            </Typography>
            <Chip label={categoryName} size="small" sx={{ borderRadius: '12px', backgroundColor: alpha(customColors.secondary, 0.1), color: customColors.secondary, fontWeight: 500, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', background: customColors.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ${parseFloat(product.precio).toFixed(2)}
            </Typography>
          </CardContent>
          <Divider sx={{ mx: 2, opacity: 0.6 }} />
          <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Box>
              <IconButton sx={{ color: customColors.primary, '&:hover': { backgroundColor: alpha(customColors.primary, 0.1) }, transition: 'all 0.3s ease' }}>
                <ShoppingCartIcon />
              </IconButton>
            </Box>
            <IconButton onClick={() => handleProductClick(product)} sx={{ color: customColors.accent, '&:hover': { backgroundColor: alpha(customColors.accent, 0.1) }, transition: 'all 0.3s ease' }}>
              <VisibilityIcon />
            </IconButton>
          </CardActions>
        </Paper>
      </motion.div>
    );
  };

  const FilterContent = (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CategoryIcon sx={{ color: customColors.accent }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>Categorías</Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip label="Todas" clickable onClick={() => setCategoriaFilter('')} color={categoriaFilter === '' ? 'primary' : 'default'} sx={{ borderRadius: '12px' }} />
        {categorias.map(cat => (
          <Chip key={cat.id_categoria} label={cat.nombre} clickable onClick={() => setCategoriaFilter(cat.id_categoria)} color={categoriaFilter === cat.id_categoria ? 'primary' : 'default'} sx={{ borderRadius: '12px' }} />
        ))}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ColorLensIcon sx={{ color: customColors.accent }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>Colores</Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip label="Todos" clickable onClick={() => setColorFilter('')} color={colorFilter === '' ? 'primary' : 'default'} sx={{ borderRadius: '12px' }} />
        {colores.map(color => (
          <Chip
            key={color.id}
            label={color.color}
            clickable
            onClick={() => setColorFilter(color.id)}
            sx={{
              backgroundColor: getColorCode(color.color),
              color: ['Blanco', 'Amarillo', 'Celeste', 'Beige'].includes(color.color) ? '#000000' : '#ffffff',
              borderRadius: '12px',
              fontWeight: 'bold',
              '&:hover': { opacity: 0.9 },
              ...(colorFilter === color.id && { border: `2px solid ${customColors.accent}` })
            }}
          />
        ))}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StraightenIcon sx={{ color: customColors.accent }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>Tallas</Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip label="Todas" clickable onClick={() => setTallaFilter('')} color={tallaFilter === '' ? 'primary' : 'default'} sx={{ borderRadius: '12px' }} />
        {tallas.map(talla => (
          <Chip key={talla.id} label={talla.talla} clickable onClick={() => setTallaFilter(talla.id)} color={tallaFilter === talla.id ? 'primary' : 'default'} sx={{ borderRadius: '12px' }} />
        ))}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SortIcon sx={{ color: customColors.accent }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 1 }}>Ordenar por</Typography>
      </Box>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Chip label="Sin ordenar" clickable onClick={() => setSortOrder('')} color={sortOrder === '' ? 'primary' : 'default'} sx={{ borderRadius: '12px' }} />
        {[
          { id: 'price-asc', label: 'Precio: Menor a Mayor' },
          { id: 'price-desc', label: 'Precio: Mayor a Menor' },
          { id: 'name-asc', label: 'Nombre: A-Z' },
          { id: 'name-desc', label: 'Nombre: Z-A' },
          { id: 'stock-desc', label: 'Disponibilidad' }
        ].map(order => (
          <Chip key={order.id} label={order.label} clickable onClick={() => setSortOrder(order.id)} color={sortOrder === order.id ? 'primary' : 'default'} sx={{ borderRadius: '12px' }} />
        ))}
      </Stack>

      <Button 
        variant="contained" 
        fullWidth 
        onClick={resetFilters} 
        disabled={!searchTerm && !colorFilter && !tallaFilter && !categoriaFilter && !sortOrder}
        sx={{ 
          mt: 2, 
          py: 1, 
          textTransform: 'none', 
          borderRadius: '12px', 
          fontWeight: 600, 
          background: customColors.gradient, 
          boxShadow: `0 4px 10px ${alpha(customColors.primary, 0.3)}`, 
          '&:hover': { boxShadow: `0 6px 15px ${alpha(customColors.primary, 0.4)}` },
          '&.Mui-disabled': { background: alpha(customColors.primary, 0.2), color: alpha(customColors.textPrimary, 0.4) }
        }}
      >
        Limpiar filtros
      </Button>
    </Stack>
  );

  const FilterDrawer = () => (
    <Drawer 
      anchor="left" 
      open={drawerOpen} 
      onClose={() => setDrawerOpen(false)} 
      PaperProps={{ sx: { borderTopRightRadius: '16px', borderBottomRightRadius: '16px', width: 300, backgroundColor: customColors.background, color: customColors.textPrimary }}}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: customColors.textPrimary }}>Filtros</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: customColors.textPrimary }}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 3, backgroundColor: alpha(customColors.textPrimary, 0.1) }} />
        {FilterContent}
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ backgroundColor: customColors.background, minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ fontWeight: 700, color: customColors.textPrimary, mb: 2, background: customColors.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Uniformes para Mujeres
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 400, color: customColors.textSecondary, maxWidth: '800px', mx: 'auto', lineHeight: 1.5 }}>
              Uniformes clínicos y quirúrgicos de alta calidad para profesionales de la salud
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
          <TextField 
            placeholder="Buscar..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            variant="outlined" 
            size="small"
            sx={{ 
              width: { xs: '100%', sm: '250px' },
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px', 
                height: '32px', 
                fontSize: '0.875rem',
                backgroundColor: customColors.cardBg,
                border: 'none',
                '& fieldset': { borderColor: alpha(customColors.accent, 0.3) },
                '&:hover fieldset': { borderColor: customColors.accent },
                '&.Mui-focused fieldset': { borderColor: customColors.accent }
              },
              '& .MuiInputBase-input': { 
                py: '4px' 
              }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: customColors.accent, fontSize: '1.2rem' }} /></InputAdornment>,
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')} size="small"><CloseIcon sx={{ fontSize: '1rem' }} /></IconButton>
                </InputAdornment>
              )
            }}
          />
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ ml: 1, color: customColors.accent, p: '4px' }}>
              <FilterListIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          )}
        </Box>

        <Grid container spacing={3}>
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: '16px', backgroundColor: customColors.cardBg, position: 'sticky', top: 20, maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: customColors.textPrimary, mb: 2 }}>Filtros</Typography>
                {catalogosLoading ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={24} sx={{ color: customColors.accent, mb: 2 }} />
                    <Typography variant="body2" sx={{ color: customColors.textSecondary }}>Cargando filtros...</Typography>
                  </Box>
                ) : FilterContent}
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                Mostrando {filteredProducts.length} de {products.length} productos
              </Typography>
            </Box>

            {error && (
              <Box sx={{ textAlign: 'center', my: 6 }}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', backgroundColor: alpha('#f44336', 0.1), '& .MuiAlert-icon': { color: '#f44336' }}}>
                  {error}
                </Alert>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2, py: 1, px: 3, borderRadius: '12px', textTransform: 'none', fontWeight: 600, background: customColors.gradient, boxShadow: `0 4px 10px ${alpha(customColors.primary, 0.3)}`, '&:hover': { boxShadow: `0 6px 15px ${alpha(customColors.primary, 0.4)}` }}} 
                  onClick={() => window.location.reload()}
                >
                  Reintentar
                </Button>
              </Box>
            )}

            <Grid container spacing={3}>
              {loading ? 
                Array.from(new Array(8)).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}><ProductCard loading={true} /></Grid>
                )) :
                filteredProducts.length > 0 ? 
                  filteredProducts.map(p => (
                    <Grid item xs={12} sm={6} md={4} key={p.id}><ProductCard product={p} loading={false} /></Grid>
                  )) :
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 8, backgroundColor: alpha(customColors.textPrimary, 0.03), borderRadius: '16px' }}>
                      <Typography variant="h6" gutterBottom sx={{ color: customColors.textPrimary }}>No se encontraron productos</Typography>
                      <Typography variant="body2" sx={{ color: customColors.textSecondary }}>Intenta cambiar los filtros de búsqueda</Typography>
                      <Button 
                        variant="outlined" 
                        sx={{ mt: 3, borderRadius: '12px', textTransform: 'none', borderColor: customColors.accent, color: customColors.accent, '&:hover': { borderColor: customColors.accent, backgroundColor: alpha(customColors.accent, 0.05) }}} 
                        onClick={resetFilters}
                      >
                        Limpiar filtros
                      </Button>
                    </Box>
                  </Grid>
              }
            </Grid>
          </Grid>
        </Grid>

        <FilterDrawer />
        {isMobile && (
          <Fab 
            color="primary" 
            sx={{ position: 'fixed', bottom: 20, right: 20, background: customColors.gradient, '&:hover': { boxShadow: `0 4px 10px ${alpha(customColors.primary, 0.5)}` }}} 
            onClick={() => setDrawerOpen(true)}
          >
            <FilterListIcon />
          </Fab>
        )}
      </Container>
    </Box>
  );
};

export default Mujer;


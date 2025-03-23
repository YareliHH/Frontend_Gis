import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  IconButton, 
  Chip,
  Container,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  useMediaQuery,
  Skeleton,
  Fab,
  Drawer,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Paper,
  alpha
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon, 
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Función para obtener datos con manejo de errores
const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return { data: null, error: error.message || 'Error al cargar datos' };
  }
};

const Hombre = () => {
  // Estados para productos
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para catálogos
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [catalogosLoading, setCatalogosLoading] = useState(true);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [tallaFilter, setTallaFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOrder, setSortOrder] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Estado para favoritos
  const [favorites, setFavorites] = useState({});
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Definir la paleta de colores personalizada con azules más suaves
  const customColors = {
    primary: '#4285f4',      // Azul más claro y suave
    secondary: '#64b5f6',    // Azul claro celestial
    accent: '#5c9ce6',       // Azul medio-claro
    lightAccent: '#90caf9',  // Azul muy claro
    rose: '#81d4fa',         // Azul cielo claro
    background: isDarkMode ? '#121212' : '#f0f8ff', // Fondo azul muy suave
    cardBg: isDarkMode ? '#1e1e2d' : '#ffffff',
    textPrimary: isDarkMode ? '#ffffff' : '#2c2c54',
    textSecondary: isDarkMode ? '#b3b3cc' : '#4b4b80',
    gradient: 'linear-gradient(135deg, #4285f4 0%, #90caf9 100%)'
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Cargar productos y catálogos en paralelo
      const [productosResult, categoriasResult, coloresResult, tallasResult] = await Promise.all([
        fetchData('http://localhost:3001/api/Hombres'),
        fetchData('http://localhost:3001/api/categorias'),
        fetchData('http://localhost:3001/api/colores'),
        fetchData('http://localhost:3001/api/tallas')
      ]);

      // Manejar errores de carga
      if (productosResult.error) {
        setError('Error al cargar productos: ' + productosResult.error);
        setLoading(false);
        return;
      }

      // Actualizar estados con datos
      setProducts(productosResult.data);
      setFilteredProducts(productosResult.data);
      
      // Actualizar catálogos si se cargaron correctamente
      if (categoriasResult.data) setCategorias(categoriasResult.data);
      if (coloresResult.data) setColores(coloresResult.data);
      if (tallasResult.data) setTallas(tallasResult.data);
      
      setCatalogosLoading(false);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Función para obtener nombre de categoría por ID
  const getCategoryName = React.useCallback((categoryId) => {
    const categoria = categorias.find(cat => cat.id_categoria === categoryId);
    return categoria ? categoria.nombre : 'Categoría N/A';
  }, [categorias]);
  
  // Función para obtener nombre de color por ID
  const getColorName = React.useCallback((colorId) => {
    const color = colores.find(col => col.id === colorId);
    return color ? color.color : 'Color N/A';
  }, [colores]);
  
  // Función para obtener código de color para visualización
  const getColorCode = (colorName) => {
    const colorMap = {
      'Azul': '#4285f4',
      'Azul Marino': '#3b78e7',
      'Negro': '#2c2c54',
      'Blanco': '#ffffff',
      'Rojo': '#e74c3c',
      'Verde': '#2ecc71',
      'Amarillo': '#f1c40f',
      'Gris': '#7f8c8d',
      'Morado': '#9b59b6',
      'Rosa': '#e252b2',
      'Naranja': '#e67e22',
      'Café': '#795548',
      'Beige': '#f5f5dc'
    };
    
    return colorMap[colorName] || '#cccccc';
  };
  
  // Función para obtener nombre de talla por ID
  const getSizeName = React.useCallback((sizeId) => {
    const talla = tallas.find(t => t.id === sizeId);
    return talla ? talla.talla : 'Talla N/A';
  }, [tallas]);

  // Función para visualizar el estado del stock
  const getStockStatus = (stockValue) => {
    if (stockValue > 5) return { text: 'En Stock', color: 'success' };
    if (stockValue > 0) return { text: `Últimas ${stockValue} piezas`, color: 'warning' };
    return { text: 'Agotado', color: 'error' };
  };

  // Función para manejar favoritos
  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Efecto para filtrar productos cuando cambian los filtros
  useEffect(() => {
    const filterProducts = () => {
      let result = [...products];
      
      // Filtrar por término de búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(product => {
          const nameMatch = product.nombre_producto?.toLowerCase().includes(searchLower);
          const descMatch = product.descripcion?.toLowerCase().includes(searchLower);
          
          let colorMatch = false;
          let categoriaMatch = false;
          let tallaMatch = false;
          
          if (colores.length > 0) {
            const colorName = getColorName(product.id_color)?.toLowerCase();
            colorMatch = colorName?.includes(searchLower);
          }
          
          if (categorias.length > 0) {
            const categoriaName = getCategoryName(product.id_categoria)?.toLowerCase();
            categoriaMatch = categoriaName?.includes(searchLower);
          }
          
          if (tallas.length > 0) {
            const tallaName = getSizeName(product.id_talla)?.toLowerCase();
            tallaMatch = tallaName?.includes(searchLower);
          }
          
          return nameMatch || descMatch || colorMatch || categoriaMatch || tallaMatch;
        });
      }
      
      // Filtrar por color
      if (colorFilter) {
        result = result.filter(product => product.id_color === parseInt(colorFilter));
      }
      
      // Filtrar por talla
      if (tallaFilter) {
        result = result.filter(product => product.id_talla === parseInt(tallaFilter));
      }
      
      // Filtrar por categoría
      if (categoriaFilter) {
        result = result.filter(product => product.id_categoria === parseInt(categoriaFilter));
      }
      
      // Filtrar por disponibilidad
      if (stockFilter !== 'all') {
        if (stockFilter === 'inStock') {
          result = result.filter(product => product.stock > 5);
        } else if (stockFilter === 'lowStock') {
          result = result.filter(product => product.stock > 0 && product.stock <= 5);
        } else if (stockFilter === 'outOfStock') {
          result = result.filter(product => product.stock <= 0);
        }
      }
      
      // Filtrar por rango de precio
      result = result.filter(product => {
        const price = parseFloat(product.precio);
        return price >= priceRange[0] && price <= priceRange[1];
      });
      
      // Ordenar productos
      if (sortOrder === 'price-asc') {
        result.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
      } else if (sortOrder === 'price-desc') {
        result.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
      } else if (sortOrder === 'name-asc') {
        result.sort((a, b) => a.nombre_producto.localeCompare(b.nombre_producto));
      } else if (sortOrder === 'name-desc') {
        result.sort((a, b) => b.nombre_producto.localeCompare(a.nombre_producto));
      } else if (sortOrder === 'stock-desc') {
        result.sort((a, b) => b.stock - a.stock);
      }
      
      setFilteredProducts(result);
    };
    
    filterProducts();
  }, [searchTerm, colorFilter, tallaFilter, categoriaFilter, stockFilter, priceRange, sortOrder, products, categorias, colores, tallas, getCategoryName, getColorName, getSizeName]);

  // Función para navegar al detalle del producto
  const handleProductClick = (product) => {
    navigate(`/cliente/detallesp/${product.id}`, { 
      state: { 
        from: 'hombres', // o 'mujeres' según el componente
        productName: product.nombre_producto 
      } 
    });
  };
  
  // Función para resetear filtros
  const resetFilters = () => {
    setSearchTerm('');
    setColorFilter('');
    setTallaFilter('');
    setCategoriaFilter('');
    setStockFilter('all');
    setPriceRange([0, 1000]);
    setSortOrder('');
    setDrawerOpen(false);
  };

  // Componente de tarjeta de producto
  const ProductCard = ({ product, loading }) => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={2} 
            sx={{ 
              height: '100%', 
              borderRadius: '16px', 
              overflow: 'hidden',
              backgroundColor: customColors.cardBg,
              transition: 'all 0.3s ease'
            }}
          >
            <Skeleton variant="rectangular" height={240} />
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Paper>
        </motion.div>
      );
    }
    
    const stockStatus = getStockStatus(product.stock);
    const colorName = !catalogosLoading ? getColorName(product.id_color) : 'Cargando...';
    const categoryName = !catalogosLoading ? getCategoryName(product.id_categoria) : 'Cargando...';
    const colorCode = getColorCode(colorName);
    const isFavorite = favorites[product.id] || false;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -10 }}
      >
        <Paper 
          elevation={2} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: customColors.cardBg,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 10px 20px ${alpha(customColors.primary, 0.15)}`
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="240"
              image={product.url || '/placeholder-image.jpg'}
              alt={product.nombre_producto}
              sx={{ 
                objectFit: 'contain', 
                pt: 2,
                cursor: 'pointer',
                transition: 'transform 0.6s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={() => handleProductClick(product)}
            />
            <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
              <Chip 
                label={stockStatus.text} 
                color={stockStatus.color} 
                size="small" 
                sx={{ 
                  fontWeight: 'bold', 
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
              <Chip 
                label={colorName}
                size="small"
                sx={{ 
                  backgroundColor: colorCode,
                  color: ['Blanco', 'Amarillo', 'Beige'].includes(colorName) ? '#000000' : '#ffffff',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} 
              />
            </Box>
          </Box>
          <CardContent sx={{ flexGrow: 1, px: 3, pt: 2 }}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 600, 
                mb: 1.5, 
                cursor: 'pointer',
                color: customColors.textPrimary,
                '&:hover': { color: customColors.accent },
                transition: 'color 0.3s ease',
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
              onClick={() => handleProductClick(product)}
            >
              {product.nombre_producto}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                height: '40px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                color: customColors.textSecondary
              }}
            >
              {product.descripcion}
            </Typography>
            
            <Chip 
              label={categoryName} 
              size="small" 
              sx={{ 
                borderRadius: '12px', 
                backgroundColor: alpha(customColors.secondary, 0.1), 
                color: customColors.secondary,
                fontWeight: 500,
                mb: 2
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  background: customColors.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                ${parseFloat(product.precio).toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
          <Divider sx={{ mx: 2, opacity: 0.6 }} />
          <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Box>
              <IconButton 
                aria-label="añadir al carrito" 
                sx={{ 
                  color: customColors.primary,
                  '&:hover': { 
                    backgroundColor: alpha(customColors.primary, 0.1) 
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ShoppingCartIcon />
              </IconButton>
              <IconButton 
                aria-label="añadir a favoritos"
                onClick={() => toggleFavorite(product.id)}
                sx={{ 
                  color: isFavorite ? customColors.rose : 'inherit',
                  '&:hover': { 
                    backgroundColor: alpha(customColors.rose, 0.1) 
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>
            <IconButton 
              aria-label="ver detalles" 
              sx={{ 
                color: customColors.accent,
                '&:hover': { 
                  backgroundColor: alpha(customColors.accent, 0.1) 
                },
                transition: 'all 0.3s ease'
              }} 
              onClick={() => handleProductClick(product)}
            >
              <VisibilityIcon />
            </IconButton>
          </CardActions>
        </Paper>
      </motion.div>
    );
  };

  // Drawer para filtros en móvil
  const FilterDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
          width: 300,
          backgroundColor: customColors.background,
          color: customColors.textPrimary
        }
      }}
    >
      <Box sx={{ width: '100%', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: customColors.textPrimary }}>
            Filtros
          </Typography>
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            sx={{ color: customColors.textPrimary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3, backgroundColor: alpha(customColors.textPrimary, 0.1) }} />
        {FilterContent}
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ 
            mt: 3, 
            py: 1.2,
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            background: customColors.gradient,
            boxShadow: `0 4px 10px ${alpha(customColors.primary, 0.3)}`,
            '&:hover': {
              boxShadow: `0 6px 15px ${alpha(customColors.primary, 0.4)}`
            }
          }}
          onClick={resetFilters}
        >
          Resetear filtros
        </Button>
      </Box>
    </Drawer>
  );

  // Contenido de filtros
  const FilterContent = (
    <Stack spacing={2.5}>
      <FormControl fullWidth variant="outlined">
        <InputLabel sx={{ color: customColors.textSecondary }}>Categoría</InputLabel>
        <Select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          label="Categoría"
          disabled={catalogosLoading}
          sx={{ 
            borderRadius: '12px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.textPrimary, 0.2)
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.accent, 0.5)
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: customColors.accent
            }
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          {categorias.map((cat) => (
            <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel sx={{ color: customColors.textSecondary }}>Color</InputLabel>
        <Select
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
          label="Color"
          disabled={catalogosLoading}
          sx={{ 
            borderRadius: '12px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.textPrimary, 0.2)
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.accent, 0.5)
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: customColors.accent
            }
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          {colores.map((color) => (
            <MenuItem key={color.id} value={color.id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: '50%', 
                    backgroundColor: getColorCode(color.color),
                    border: '1px solid rgba(0,0,0,0.1)',
                    mr: 1.5 
                  }} 
                />
                {color.color}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel sx={{ color: customColors.textSecondary }}>Talla</InputLabel>
        <Select
          value={tallaFilter}
          onChange={(e) => setTallaFilter(e.target.value)}
          label="Talla"
          disabled={catalogosLoading}
          sx={{ 
            borderRadius: '12px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.textPrimary, 0.2)
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.accent, 0.5)
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: customColors.accent
            }
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          {tallas.map((talla) => (
            <MenuItem key={talla.id} value={talla.id}>
              {talla.talla}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel sx={{ color: customColors.textSecondary }}>Disponibilidad</InputLabel>
        <Select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          label="Disponibilidad"
          sx={{ 
            borderRadius: '12px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.textPrimary, 0.2)
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.accent, 0.5)
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: customColors.accent
            }
          }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="inStock">En stock</MenuItem>
          <MenuItem value="lowStock">Últimas piezas</MenuItem>
          <MenuItem value="outOfStock">Agotado</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel sx={{ color: customColors.textSecondary }}>Ordenar por</InputLabel>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          label="Ordenar por"
          sx={{ 
            borderRadius: '12px',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.textPrimary, 0.2)
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(customColors.accent, 0.5)
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: customColors.accent
            }
          }}
        >
          <MenuItem value="">Sin ordenar</MenuItem>
          <MenuItem value="price-asc">Precio: Menor a Mayor</MenuItem>
          <MenuItem value="price-desc">Precio: Mayor a Menor</MenuItem>
          <MenuItem value="name-asc">Nombre: A-Z</MenuItem>
          <MenuItem value="name-desc">Nombre: Z-A</MenuItem>
          <MenuItem value="stock-desc">Disponibilidad</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  // Renderizado principal
  return (
    <Box 
      sx={{ 
        backgroundColor: customColors.background,
        minHeight: '100vh',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Container maxWidth="xl" sx={{ py: 5 }}>
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>

            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                fontWeight: 400, 
                color: customColors.textSecondary,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.5
              }}
            >
              Uniformes clínicos y quirúrgicos de alta calidad para profesionales de la salud
            </Typography>
          </Box>
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <Box sx={{ mb: 5 }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: '16px',
              backgroundColor: customColors.cardBg
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre, color, categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: customColors.accent }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(customColors.textPrimary, 0.2)
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(customColors.accent, 0.5)
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: customColors.accent
                      }
                    }
                  }}
                />
              </Grid>
              
              {/* Filtros para desktop */}
              {!isMobile && (
                <>
                  <Grid item xs={6} md={1.5}>
                    <FormControl fullWidth variant="outlined" size="medium">
                      <InputLabel sx={{ color: customColors.textSecondary }}>Categoría</InputLabel>
                      <Select
                        value={categoriaFilter}
                        onChange={(e) => setCategoriaFilter(e.target.value)}
                        label="Categoría"
                        disabled={catalogosLoading}
                        sx={{ 
                          borderRadius: '12px',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(customColors.textPrimary, 0.2)
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(customColors.accent, 0.5)
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: customColors.accent
                          }
                        }}
                      >
                        <MenuItem value="">Todas</MenuItem>
                        {categorias.map((cat) => (
                          <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                            {cat.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={1.5}>
                    <FormControl fullWidth variant="outlined" size="medium">
                      <InputLabel sx={{ color: customColors.textSecondary }}>Color</InputLabel>
                      <Select
                        value={colorFilter}
                        onChange={(e) => setColorFilter(e.target.value)}
                        label="Color"
                        disabled={catalogosLoading}
                        sx={{ 
                          borderRadius: '12px',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(customColors.textPrimary, 0.2)
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(customColors.accent, 0.5)
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: customColors.accent
                          }
                        }}
                      >
                        <MenuItem value="">Todos</MenuItem>
                        {colores.map((color) => (
                          <MenuItem key={color.id} value={color.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box 
                                sx={{ 
                                  width: 16, 
                                  height: 16, 
                                  borderRadius: '50%', 
                                  backgroundColor: getColorCode(color.color),
                                  border: '1px solid rgba(0,0,0,0.1)',
                                  mr: 1 
                                }} 
                              />
                              {color.color}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={1.5}>
                    <FormControl fullWidth variant="outlined" size="medium">
                      <InputLabel sx={{ color: customColors.textSecondary }}>Talla</InputLabel>
                      <Select
                        value={tallaFilter}
                        onChange={(e) => setTallaFilter(e.target.value)}
                        label="Talla"
                        disabled={catalogosLoading}
                        sx={{ 
                          borderRadius: '12px',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(customColors.textPrimary, 0.2)
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(customColors.accent, 0.5)
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: customColors.accent
                          }
                        }}
                      >
                        <MenuItem value="">Todas</MenuItem>
                        {tallas.map((talla) => (
                          <MenuItem key={talla.id} value={talla.id}>
                            {talla.talla}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={1.5}>
                    <FormControl fullWidth variant="outlined" size="medium">
                      <InputLabel sx={{ color: customColors.textSecondary }}>Ordenar</InputLabel>
                      <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Ordenar"
                        sx={{ 
                          borderRadius: '12px',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(customColors.textPrimary, 0.2)
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(customColors.accent, 0.5)
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: customColors.accent
                          }
                        }}
                      >
                        <MenuItem value="">Sin ordenar</MenuItem>
                        <MenuItem value="price-asc">Precio: ↑</MenuItem>
                        <MenuItem value="price-desc">Precio: ↓</MenuItem>
                        <MenuItem value="name-asc">Nombre: A-Z</MenuItem>
                        <MenuItem value="name-desc">Nombre: Z-A</MenuItem>
                        <MenuItem value="stock-desc">Disponibilidad</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
              
              {/* Botón de filtros para móvil */}
              {isMobile && (
                <Grid item xs={12}>
                  <Button 
                    variant="outlined" 
                    startIcon={<FilterListIcon />}
                    fullWidth
                    onClick={() => setDrawerOpen(true)}
                    sx={{ 
                      borderRadius: '12px',
                      textTransform: 'none',
                      py: 1.2,
                      color: customColors.accent,
                      borderColor: customColors.accent,
                      '&:hover': {
                        borderColor: customColors.accent,
                        backgroundColor: alpha(customColors.accent, 0.05)
                      }
                    }}
                  >
                    Filtros y Ordenación
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>

        {/* Estado de carga de catálogos */}
        {catalogosLoading && !loading && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: '12px',
              '& .MuiAlert-icon': {
                color: customColors.accent
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1, color: customColors.accent }} />
              Cargando información de categorías, colores y tallas...
            </Box>
          </Alert>
        )}

        {/* Estadísticas de resultados */}
        <Box sx={{ 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 1
        }}>
          <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
            Mostrando {filteredProducts.length} de {products.length} productos
          </Typography>
          {(searchTerm || colorFilter || tallaFilter || categoriaFilter || stockFilter !== 'all' || sortOrder) && (
            <Button 
              size="small" 
              onClick={resetFilters}
              startIcon={<CloseIcon />}
              sx={{ 
                color: customColors.accent,
                '&:hover': {
                  backgroundColor: alpha(customColors.accent, 0.05)
                }
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </Box>
        
        <Divider sx={{ mb: 4, backgroundColor: alpha(customColors.textPrimary, 0.1) }} />

        {/* Mensaje de error */}
        {error && (
          <Box sx={{ textAlign: 'center', my: 6 }}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                backgroundColor: alpha('#f44336', 0.1),
                '& .MuiAlert-icon': {
                  color: '#f44336'
                }
              }}
            >
              {error}
            </Alert>
            <Button 
              variant="contained" 
              sx={{ 
                mt: 2,
                py: 1,
                px: 3,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                background: customColors.gradient,
                boxShadow: `0 4px 10px ${alpha(customColors.primary, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 15px ${alpha(customColors.primary, 0.4)}`
                }
              }}
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </Box>
        )}

        {/* Listado de productos */}
        <Grid container spacing={3}>
          {loading ? (
            // Skeleton para carga
            Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <ProductCard loading={true} />
              </Grid>
            ))
          ) : filteredProducts.length > 0 ? (
            // Productos filtrados
            filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} loading={false} />
              </Grid>
            ))
          ) : (
            // No hay resultados
            <Grid item xs={12}>
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                backgroundColor: alpha(customColors.textPrimary, 0.03),
                borderRadius: '16px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: customColors.textPrimary }}>
                  No se encontraron productos
                </Typography>
                <Typography variant="body2" sx={{ color: customColors.textSecondary }}>
                  Intenta cambiar los filtros de búsqueda
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    mt: 3,
                    borderRadius: '12px',
                    textTransform: 'none',
                    borderColor: customColors.accent,
                    color: customColors.accent,
                    '&:hover': {
                      borderColor: customColors.accent,
                      backgroundColor: alpha(customColors.accent, 0.05)
                    }
                  }}
                  onClick={resetFilters}
                >
                  Limpiar filtros
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
        
        {/* Drawer para filtros en móvil */}
        <FilterDrawer />
        
        {/* Botón flotante para acceso rápido a los filtros */}
        {isMobile && (
          <Fab 
            color="primary" 
            aria-label="filtrar" 
            sx={{ 
              position: 'fixed', 
              bottom: 20, 
              right: 20,
              background: customColors.gradient,
              '&:hover': {
                boxShadow: `0 4px 10px ${alpha(customColors.primary, 0.5)}`
              }
            }}
            onClick={() => setDrawerOpen(true)}
          >
            <FilterListIcon />
          </Fab>
        )}
      </Container>
    </Box>
  );
};

export default Hombre;
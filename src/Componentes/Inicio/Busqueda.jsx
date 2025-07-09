import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Función helper para hacer peticiones al backend
const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

// Componente de búsqueda principal
const Busqueda = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q"); // Usamos "q" para alinearnos con la navegación y el backend

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Datos de muestra para desarrollo
  const MOCK_DATA = [
    { id: 1, nombre_producto: "Filipina Azul", descripcion: "Filipina médica de alta calidad, color azul cielo", precio: 450, categoria: "Uniforme", url: "https://via.placeholder.com/300/87CEEB/000000?text=Filipina+Azul" },
    { id: 2, nombre_producto: "Pantalón Blanco", descripcion: "Pantalón médico de algodón, color blanco", precio: 350, categoria: "Uniforme", url: "https://via.placeholder.com/300/FFFFFF/000000?text=Pantalón+Blanco" },
    { id: 3, nombre_producto: "Bata Médica", descripcion: "Bata médica de laboratorio, manga larga", precio: 550, categoria: "Bata", url: "https://via.placeholder.com/300/F5F5DC/000000?text=Bata+Médica" },
    { id: 4, nombre_producto: "Estetoscopio", descripcion: "Estetoscopio profesional de doble campana", precio: 1200, categoria: "Equipo", url: "https://via.placeholder.com/300/C0C0C0/000000?text=Estetoscopio" }
  ];

  // Efecto para cargar los resultados cuando cambia la consulta
  useEffect(() => {
    const buscarProductos = async () => {
      if (!query || query.trim() === '') return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Usar la misma estructura de llamada que en otros componentes
        const data = await fetchData(`https://backend-gis-1.onrender.com/api/buscar?q=${query}`);
        setResultados(data);
      } catch (err) {
        console.error("Error al buscar productos:", err);
        
        // En modo desarrollo, usar datos de muestra si el backend no está disponible
        if (process.env.NODE_ENV === 'development') {
          console.log("Usando datos de muestra para desarrollo");
          const filtrados = MOCK_DATA.filter(
            producto => producto.nombre_producto.toLowerCase().includes(query.toLowerCase()) || 
                        producto.descripcion.toLowerCase().includes(query.toLowerCase())
          );
          setResultados(filtrados);
        } else {
          setError("Ocurrió un error al buscar productos. Por favor, intente nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    buscarProductos();
  }, [query]);

  // Renderizado de tarjetas de productos
  const renderProductos = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    if (resultados.length === 0) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            my: 4,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos que coincidan con "{query}"
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Intenta con otros términos o categorías
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {resultados.map((producto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={producto.url || '/placeholder-image.jpg'}
                  alt={producto.nombre_producto}
                  sx={{ objectFit: 'contain', p: 1 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" noWrap>
                    {producto.nombre_producto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    height: '3em', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1
                  }}>
                    {producto.descripcion}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${Number(producto.precio).toFixed(2)}
                    </Typography>
                    <Chip 
                      label={producto.categoria || 'General'} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        mb: 3, 
        fontWeight: 700,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: 0,
          width: '60px',
          height: '4px',
          backgroundColor: 'primary.main',
          borderRadius: '2px'
        }
      }}>
        Resultados de búsqueda: "{query}"
      </Typography>
      
      {renderProductos()}
    </Container>
  );
};

export default Busqueda;
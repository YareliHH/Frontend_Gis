import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Container, Card, CardContent, CardMedia, CardActionArea, Chip, Button, Badge, Divider, Stack } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useNavigate } from 'react-router-dom';

// Importar imágenes
import img14 from '../imagenes/img14.jpg';
import img9 from '../imagenes/img9.jpg';
import img17h from '../imagenes/img17h.jpg';
import img20 from '../imagenes/img20.jpg';
import img21 from '../imagenes/img21.jpg';
import img5 from '../imagenes/img5.jpg';
import img22 from '../imagenes/img22.jpg';
import img4 from '../imagenes/img4.jpg';

const OfertasCliente = () => {
  const navigate = useNavigate();

  const colors = {
    background: '#ffffff',  // Cambiado a blanco
    card: '#f9f9f9',  // Un gris muy claro
    primaryText: '#333333',
    secondaryText: '#666666',
    accent: '#5e35b1', // Púrpura elegante
    accent2: '#00bcd4', // Turquesa complementario
    clinical: '#8BC34A',
    surgical: '#42A5F5',
    discount: '#f44336',
    stock: {
      available: '#4CAF50',
      low: '#FF9800',
      outOfStock: '#f44336'
    }
  };
  

  const products = [
    { image: img9, name: "Uniforme Clínico", price: "$50", discount: "10%", type: "Clínico", stock: "En Stock" },
    { image: img17h, name: "Batas Quirúrgicas", price: "$80", discount: "15%", type: "Quirúrgico", stock: "Últimas piezas" },
    { image: img20, name: "Camisón Médico", price: "$45", discount: "5%", type: "Clínico", stock: "Agotado" },
    { image: img14, name: "Mascarilla Quirúrgica", price: "$15", discount: "20%", type: "Quirúrgico", stock: "En Stock" },
    { image: img21, name: "Gorro Quirúrgico", price: "$12", discount: "", type: "Quirúrgico", stock: "En Stock" },
    { image: img5, name: "Guantes Clínicos", price: "$20", discount: "10%", type: "Clínico", stock: "Últimas piezas" },
    { image: img22, name: "Bata Estéril", price: "$70", discount: "", type: "Quirúrgico", stock: "En Stock" },
    { image: img4, name: "Zapatillas Médicas", price: "$30", discount: "5%", type: "Clínico", stock: "Últimas piezas" }
  ];

  const handleProductClick = (product) => {
    navigate('/detalles-ofertas', { state: { product } });
  };

  const getStockColor = (stockStatus) => {
    switch (stockStatus) {
      case 'En Stock': return colors.stock.available;
      case 'Últimas piezas': return colors.stock.low;
      case 'Agotado': return colors.stock.outOfStock;
      default: return colors.stock.available;
    }
  };

  const getStockIcon = (stockStatus) => {
    return <InventoryIcon fontSize="small" sx={{ mr: 0.5 }} />;
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.background,
      minHeight: '100vh',
      py: 6
    }}>
      <Container maxWidth="lg">
        {/* Header con efecto de gradiente */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 8,
          p: 6,
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}>
          <Typography variant="h3" sx={{ 
            color: '#ffffff', 
            fontWeight: 800, 
            fontFamily: 'Montserrat, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            OFERTAS EXCLUSIVAS
          </Typography>
          <Typography variant="h5" sx={{ 
            color: '#ffffff', 
            fontFamily: 'Roboto, sans-serif',
            mt: 2,
            opacity: 0.95,
            maxWidth: '700px',
            mx: 'auto'
          }}>
            Promociones especiales para clientes nuevos
          </Typography>
          <Chip 
            icon={<LocalOfferIcon />} 
            label="DESCUENTOS DE HASTA UN 20%" 
            sx={{ 
              mt: 3, 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              color: colors.accent,
              fontWeight: 'bold',
              fontSize: '0.9rem',
              py: 2.5,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }} 
          />
        </Box>

        {/* Productos */}
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  backgroundColor: colors.card,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 30px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  {/* Stock badge */}
                  <Chip
                    icon={getStockIcon(product.stock)}
                    label={product.stock}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      backgroundColor: getStockColor(product.stock),
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                  
                  {/* Discount badge */}
                  {product.discount && (
                    <Chip
                      icon={<LocalOfferIcon />}
                      label={`-${product.discount}`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: colors.discount,
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    />
                  )}
                  
                  {/* Type badge */}
                  <Chip
                    label={product.type}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      backgroundColor: product.type === "Clínico" ? colors.clinical : colors.surgical,
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                </Box>

                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 3
                }}>
                  <Typography 
                    variant="h6" 
                    component="div"
                    onClick={() => handleProductClick(product)}
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      color: colors.primaryText,
                      cursor: 'pointer',
                      '&:hover': {
                        color: colors.accent
                      }
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Typography 
                      variant="h5" 
                      component="div"
                      sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        color: colors.accent
                      }}
                    >
                      {product.price}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2
                    }}>
                      <Button 
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        disabled={product.stock === "Agotado"}
                        sx={{
                          backgroundColor: colors.accent,
                          textTransform: 'none',
                          fontWeight: 600,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          '&:hover': {
                            backgroundColor: colors.accent2
                          }
                        }}
                      >
                        Añadir
                      </Button>
                      
                      <Button 
                        variant="outlined"
                        onClick={() => handleProductClick(product)}
                        sx={{
                          borderColor: colors.accent,
                          color: colors.accent,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: colors.accent2,
                            color: colors.accent2
                          }
                        }}
                      >
                        Detalles
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default OfertasCliente
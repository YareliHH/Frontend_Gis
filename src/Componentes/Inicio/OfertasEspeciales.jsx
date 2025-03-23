import React, { useState } from 'react';
import { Box, Typography, Grid, Container, Divider, Chip, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Importar imágenes locales de los productos
import img14 from '../imagenes/img14.jpg';
import img9 from '../imagenes/img9.jpg';
import img17h from '../imagenes/img17h.jpg';
import img20 from '../imagenes/img20.jpg';
import img21 from '../imagenes/img21.jpg';
import img5 from '../imagenes/img5.jpg';
import img22 from '../imagenes/img22.jpg';
import img4 from '../imagenes/img4.jpg';

// Componentes estilizados personalizados
const ProductImage = styled(Box)(({ theme }) => ({
  height: 200,
  width: '100%',
  objectFit: 'cover',
  borderRadius: '12px 12px 0 0',
  transition: 'transform 0.5s ease-in-out',
}));

const ProductCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: '12px',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    '& .MuiBox-root img': {
      transform: 'scale(1.08)',
    },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: '40%',
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const TypeBadge = styled(Chip)(({ type }) => ({
  backgroundColor: type === 'Clínico' ? '#E3F2FD' : '#FFF8E1',
  color: type === 'Clínico' ? '#1565C0' : '#FF8F00',
  fontWeight: 'bold',
  marginRight: 8,
}));

const PriceTag = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '4px 12px',
  borderRadius: '0 0 0 12px',
  position: 'absolute',
  top: 0,
  right: 0,
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  marginTop: 'auto',
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  padding: '10px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    transform: 'translateY(-2px)',
  },
}));

const OfertasEspeciales = () => {
  // Estado para manejar la visualización de productos en oferta
  const [showOffers, setShowOffers] = useState(true);
  
  // Colores del tema
  const colors = {
    primary: '#1976D2',
    secondary: '#FF5722',
    lightBg: '#F5F7FA',
    darkText: '#212121',
    lightText: '#757575',
  };

  // Productos en oferta especial
  const products = [
    { 
      image: img9, 
      name: "Uniforme Clínico Premium", 
      price: "$50", 
      discount: "15% OFF", 
      type: "Clínico",
      description: "Uniforme médico de alta calidad con tejido antimicrobiano."
    },
    { 
      image: img17h, 
      name: "Batas Quirúrgicas Estériles", 
      price: "$80", 
      discount: "20% OFF", 
      type: "Quirúrgico",
      description: "Bata quirúrgica con protección reforzada y materiales hipoalergénicos."
    },
    { 
      image: img20, 
      name: "Camisón Médico Confort", 
      price: "$45", 
      discount: "10% OFF", 
      type: "Clínico",
      description: "Camisón diseñado para el máximo confort durante largas jornadas."
    },
    { 
      image: img14, 
      name: "Mascarilla Quirúrgica N95", 
      price: "$15", 
      discount: "25% OFF", 
      type: "Quirúrgico",
      description: "Mascarilla de alta filtración con certificación internacional."
    }
  ];

  // Nuevos productos 
  const newProducts = [
    { 
      image: img21, 
      name: "Gorro Quirúrgico Ultraligero", 
      price: "$12", 
      new: true, 
      type: "Quirúrgico",
      description: "Gorro quirúrgico transpirable con ajuste perfecto."
    },
    { 
      image: img5, 
      name: "Guantes Clínicos Sin Látex", 
      price: "$20", 
      new: true, 
      type: "Clínico",
      description: "Guantes de nitrilo con máxima sensibilidad táctil."
    },
    { 
      image: img22, 
      name: "Bata Estéril Reforzada", 
      price: "$70", 
      new: true, 
      type: "Quirúrgico",
      description: "Bata con barrera adicional para procedimientos de alto riesgo."
    },
    { 
      image: img4, 
      name: "Zapatillas Médicas Ergonómicas", 
      price: "$30", 
      new: true, 
      type: "Clínico",
      description: "Calzado profesional con soporte para largas jornadas."
    }
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(180deg, ${colors.lightBg} 0%, #FFFFFF 100%)`,
        minHeight: '100vh',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Encabezado de la página */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ofertas Especiales
          </Typography>
          <Typography variant="h6" sx={{ color: colors.lightText, maxWidth: '700px', mx: 'auto', mb: 3 }}>
            Descubre nuestra selección de productos médicos de alta calidad a precios exclusivos
          </Typography>
          <Divider sx={{ maxWidth: '200px', mx: 'auto', mb: 4, borderColor: colors.primary, borderWidth: 2 }} />
        </Box>

        {/* Sección de Productos en Oferta */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LocalOfferIcon sx={{ color: colors.secondary, mr: 1, fontSize: 30 }} />
            <SectionTitle variant="h4">
              Ofertas Destacadas
            </SectionTitle>
          </Box>
          
          <Grid container spacing={3}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ProductCard elevation={3}>
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <PriceTag>{product.price}</PriceTag>
                    <Box sx={{ overflow: 'hidden' }}>
                      <ProductImage
                        component="img"
                        src={product.image}
                        alt={product.name}
                      />
                    </Box>
                    <Chip
                      label={product.discount}
                      color="secondary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <TypeBadge 
                        label={product.type} 
                        type={product.type} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        color: colors.darkText,
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.lightText,
                        mb: 2,
                        flexGrow: 1,
                      }}
                    >
                      {product.description}
                    </Typography>
                    
                    <AddToCartButton 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                    >
                      Añadir al Carrito
                    </AddToCartButton>
                  </Box>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Sección de Nuevos Productos */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <NewReleasesIcon sx={{ color: colors.primary, mr: 1, fontSize: 30 }} />
            <SectionTitle variant="h4">
              Novedades Recién Llegadas
            </SectionTitle>
          </Box>
          
          <Grid container spacing={3}>
            {newProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ProductCard elevation={3}>
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <PriceTag>{product.price}</PriceTag>
                    <Box sx={{ overflow: 'hidden' }}>
                      <ProductImage
                        component="img"
                        src={product.image}
                        alt={product.name}
                      />
                    </Box>
                    {product.new && (
                      <Chip
                        label="NUEVO"
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 10,
                          left: 10,
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <TypeBadge 
                        label={product.type} 
                        type={product.type} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        color: colors.darkText,
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.lightText,
                        mb: 2,
                        flexGrow: 1,
                      }}
                    >
                      {product.description}
                    </Typography>
                    
                    <AddToCartButton 
                      variant="contained" 
                      color="secondary" 
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                    >
                      Añadir al Carrito
                    </AddToCartButton>
                  </Box>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default OfertasEspeciales;
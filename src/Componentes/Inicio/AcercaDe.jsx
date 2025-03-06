import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

// Importar imágenes
import ACERCA1 from '../imagenes/acerca1.jpg';

const AcercaDe = () => {
  const colors = {
    primaryText: '#000000',
    highlightText: '#1565C0', // Azul para resaltar títulos en hover
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#FFFFFF', // Fondo blanco
      }}
    >
      {/* Recuadro con el contenido */}
      <Paper
        sx={{
          padding: '20px',
          backgroundColor: '#FFFFFF',
          maxWidth: '800px',
          borderRadius: '8px',
          boxShadow: 3,
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 6, // Elevación en hover
          },
        }}
      >
        {/* Título */}
        <Typography
          variant="h4"
          sx={{
            color: colors.primaryText,
            fontWeight: 'bold',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            mb: 2,
            textAlign: 'center',
            transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out',
            '&:hover': {
              color: colors.highlightText,
              transform: 'scale(1.05)',
            },
          }}
        >
          Acerca de
        </Typography>

        {/* Imagen con efecto de zoom en hover */}
        <Box
          component="img"
          src={ACERCA1}
          alt="Imagen Acerca de Nosotros"
          sx={{
            width: '100%',
            height: 'auto',
            marginBottom: '20px',
            objectFit: 'cover',
            borderRadius: '8px',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
            },
          }}
        />

        {/* Descripción */}
        <Typography
          variant="body1"
          sx={{
            color: colors.primaryText,
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            textAlign: 'left',
            mb: 2,
          }}
        >
          GisLive Boutique Clínica es una empresa dedicada a la venta de uniformes clínicos y quirúrgicos de alta calidad, tanto en su tienda física como en línea. Con una amplia experiencia en el sector, nos especializamos en ofrecer productos que combinan confort, durabilidad y diseño, adaptados a las necesidades del personal de salud.
        </Typography>

        {/* Misión y Visión lado a lado con efecto en hover */}
        <Grid container spacing={4}>
          {[
            { title: 'Misión', text: 'Nuestra misión es ofrecer uniformes de alta calidad que superen las expectativas de nuestros clientes, garantizando un servicio excepcional.' },
            { title: 'Visión', text: 'Ser una empresa líder en la fabricación y comercialización de uniformes, reconocida por su compromiso con la calidad, innovación y servicio al cliente.' },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper
                sx={{
                  padding: '15px',
                  borderRadius: '8px',
                  transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: colors.primaryText,
                    mb: 2,
                    transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out',
                    '&:hover': {
                      color: colors.highlightText,
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body1" sx={{ color: colors.primaryText }}>
                  {item.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Valores con efecto de resaltado en hover */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: colors.primaryText,
            mt: 4,
            mb: 2,
            transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out',
            '&:hover': {
              color: colors.highlightText,
              transform: 'scale(1.05)',
            },
          }}
        >
          Valores
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: colors.primaryText,
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            mb: 2,
            '& span': {
              fontWeight: 'bold',
              transition: 'color 0.3s ease-in-out',
            },
            '& span:hover': {
              color: colors.highlightText, // Cambio de color al pasar el mouse
            },
          }}
        >
          <span>Compromiso:</span> Trabajamos con dedicación para ofrecer lo mejor a nuestros clientes. <br />
          <span>Innovación:</span> Buscamos siempre nuevas soluciones para mejorar nuestros productos y servicios. <br />
          <span>Calidad:</span> Nos aseguramos de que cada prenda que fabricamos sea de la mejor calidad posible. <br />
          <span>Responsabilidad:</span> Actuamos con ética y transparencia en todas nuestras actividades.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AcercaDe;

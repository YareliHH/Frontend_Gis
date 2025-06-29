import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import cecyte from '../imagenes/cecyte.jpeg';
import clinica_huejutla from '../imagenes/clinica_huejutla.jpeg';
import ices from '../imagenes/ices.png';

const colaboraciones = [
  {
    nombre: 'Clínica Huejutla',
    descripcion:
      'Colaboración activa para dotar de uniformes clínicos al personal médico y recibir retroalimentación directa sobre funcionalidad y confort.',
    imagen: clinica_huejutla,
  },
  {
    nombre: 'CECyTE Hidalgo',
    descripcion:
      'Participación en actividades escolares y talleres con estudiantes del área de servicios de salud y emprendimiento.',
    imagen: cecyte,
  },
  {
    nombre: 'ICESH',
    descripcion:
      'Vinculación con la institución para prácticas profesionales, asesorías y desarrollo de proyectos conjuntos.',
    imagen: ices,
  },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  height: '100%',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
  borderRadius: theme.shape.borderRadius * 3,
  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[12],
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '120px',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '50%',
  marginBottom: theme.spacing(3),
  border: `2px solid ${theme.palette.primary.light}`,
  boxShadow: theme.shadows[4],
}));

const Colaboraciones = () => {
  return (
    <Box
      sx={{
        bgcolor: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)',
        py: 12,
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={1200}>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.dark',
              mb: 5,
              textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
              fontSize: { xs: '2rem', sm: '3rem' },
            }}
          >
            Nuestras Colaboraciones
          </Typography>
        </Fade>
        <Typography
          variant="body1"
          align="center"
          paragraph
          sx={{
            color: 'text.secondary',
            maxWidth: '800px',
            mx: 'auto',
            mb: 10,
            fontSize: '1.2rem',
            lineHeight: 1.6,
          }}
        >
          En <strong>GisLive Boutique Clínica</strong>, nos enorgullece colaborar
          con instituciones educativas y del sector salud para potenciar la
          calidad de nuestros servicios y contribuir al bienestar de la comunidad.
        </Typography>

        <Grid container spacing={5}>
          {colaboraciones.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in timeout={1500 + index * 400}>
                <StyledPaper elevation={6}>
                  <StyledImage src={item.imagen} alt={item.nombre} />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: 'primary.main',
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    {item.nombre}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '1rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.descripcion}
                  </Typography>
                </StyledPaper>
              </Fade>
            </Grid>
          ))}
        </Grid>

      <Box mt={16} textAlign="center">
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              fontSize: '1rem',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Estas alianzas reflejan nuestro compromiso con la excelencia, la
            innovación y el servicio profesional.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Colaboraciones;
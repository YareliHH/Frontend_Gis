import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Fade,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha
} from '@mui/material';
import {
  Gavel,
  Info
} from '@mui/icons-material';

const DeslindeLegal = () => {
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
   axios.get('https://backend-gis-1.onrender.com/api/deslinde/deslinde')
      .then(response => {
        setContenido(response.data[0]?.contenido || 'Deslinde legal no disponible.');
      })
      .catch(error => {
        console.error('Error al obtener el deslinde legal:', error);
        setContenido('Error al cargar el deslinde legal.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="lg">
      <Fade in timeout={500}>
        <Box mt={6} mb={10}>
          {/* Título */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.6rem', md: '2rem' },
                color: theme.palette.primary.main,
                mt: 2
              }}
            >
              Deslinde Legal
            </Typography>
          </Box>

          {/* Contenido */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              boxShadow: `0 24px 80px ${alpha(theme.palette.common.black, 0.08)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 5,
                background: `linear-gradient(90deg, 
                  ${theme.palette.primary.main} 0%, 
                  ${theme.palette.secondary.main} 50%, 
                  ${theme.palette.primary.main} 100%)`
              }
            }}
          >
            <CardContent sx={{ px: { xs: 4, md: 8 }, py: { xs: 3, md: 6 } }}>
              {loading ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  py={12}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      mb: 4
                    }}
                  >
                    <CircularProgress
                      size={80}
                      thickness={3}
                      sx={{
                        color: theme.palette.primary.main,
                        animationDuration: '1.5s'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Gavel
                        sx={{
                          fontSize: 30,
                          color: theme.palette.primary.main,
                          opacity: 0.7
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Cargando deslinde legal...
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, opacity: 0.7 }}>
                    Preparando la información legal
                  </Typography>
                </Box>
              ) : (
                <Fade in timeout={1200}>
                  <Box>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: 1.8,
                        letterSpacing: '0.2px',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        color: theme.palette.text.primary,
                        textAlign: 'justify'
                      }}
                    >
                      {contenido}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>

          {/* Pie de página */}
          <Box mt={8} textAlign="center">
            <Divider
              sx={{
                mb: 4,
                opacity: 0.4,
                '&::before, &::after': {
                  borderColor: alpha(theme.palette.primary.main, 0.3)
                }
              }}
            />

            <Paper
              elevation={0}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                px: 4,
                py: 2,
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.9),
                border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.06)}`
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: alpha(theme.palette.info.main, 0.1),
                }}
              >
                <Info sx={{ fontSize: 20, color: theme.palette.info.main }} />
              </Box>
              <Box textAlign="left">
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                  Última actualización: Junio 2025
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
                  Revisamos constantemente nuestras declaraciones legales
                </Typography>
              </Box>
            </Paper>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 4,
                opacity: 0.7,
                maxWidth: 500,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Si tienes preguntas sobre este deslinde legal, no dudes en contactarnos.
              Estamos comprometidos con la transparencia y legalidad.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default DeslindeLegal;

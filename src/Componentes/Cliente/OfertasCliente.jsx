import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CircularProgress
} from '@mui/material';

const ListaPromociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerPromociones = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/promo/get');
        setPromociones(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener promociones:', error);
        setLoading(false);
      }
    };

    obtenerPromociones();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Cargando promociones...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Promociones</Typography>
      <Grid container spacing={3}>
        {promociones.map((promo) => (
          <Grid item xs={12} sm={6} md={4} key={promo.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={promo.imagen}
                alt={promo.titulo}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>{promo.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{promo.descripcion}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListaPromociones;

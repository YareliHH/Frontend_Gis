import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

const PaginaCliente = () => {
  const [prendas, setPrendas] = useState([]);

  useEffect(() => {
    // Simulando la obtención de datos de las prendas con las imágenes proporcionadas
    const fetchPrendas = () => {
      const prendasData = [
        { id: 1, nombre: 'Uniforme Médico Azul', descripcion: 'Uniforme cómodo y elegante para personal médico.', precio: 499, imagen: "https://i.pinimg.com/564x/09/20/1c/09201c1b05f91d5dde2e779d80543536.jpg" },
        { id: 2, nombre: 'Uniforme Médico Verde', descripcion: 'Uniforme ideal para ambientes clínicos, en color verde.', precio: 549, imagen: "https://i.pinimg.com/564x/bd/59/b8/bd59b85c8336650a9254393e2395d073.jpg" },
        { id: 3, nombre: 'Uniforme Médico Negro', descripcion: 'Uniforme práctico con diseño moderno y funcional.', precio: 529, imagen: "https://i.pinimg.com/736x/d9/d4/0e/d9d40e89aa51c7449cd9e50b6a25829f.jpg" },
        { id: 4, nombre: 'Uniforme Médico Azul', descripcion: 'Uniforme clásico en color azul para personal médico.', precio: 499, imagen: "https://i.pinimg.com/736x/6d/e7/cc/6de7ccb165aeeb4aca55d92102e512e5.jpg" },
        { id: 5, nombre: 'Uniforme Médico verde', descripcion: 'Uniforme con un diseño moderno en color verde.', precio: 569, imagen: "https://i.pinimg.com/564x/78/cd/7e/78cd7e1b1d841c78e776420790fd6923.jpg" },
        { id: 6, nombre: 'Uniforme Médico Morado', descripcion: 'Uniforme profesional en tono morado, ideal para consultorios.', precio: 499, imagen: "https://i.pinimg.com/564x/48/3a/07/483a073bcb4ddcbf070155828e83c81e.jpg" },
        { id: 7, nombre: 'Uniforme Médico Blanco', descripcion: 'Uniforme elegante y funcional en color blanco.', precio: 589, imagen: "https://i.pinimg.com/564x/f8/8f/6b/f88f6bbd42440eef70181e0b2e05cee3.jpg" },
        { id: 8, nombre: 'Uniforme Médico Azul Claro', descripcion: 'Uniforme ligero y cómodo en azul claro.', precio: 479, imagen: "https://i.pinimg.com/564x/81/45/cb/8145cb2cc1fcfcd336bf6c27ab3b685d.jpg" },
      ];
      setPrendas(prendasData);
    };

    fetchPrendas();
  }, []);

  return (
    <Container>
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Prendas de Uniformes
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Explora nuestra colección de uniformes clínicos y elige lo que mejor se adapte a tus necesidades.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {prendas.map((prenda) => (
          <Grid item key={prenda.id} xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="200"
                image={prenda.imagen}
                alt={prenda.nombre}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {prenda.nombre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {prenda.descripcion}
                </Typography>
                <Typography variant="h6" color="textPrimary" sx={{ mt: 2 }}>
                  ${prenda.precio} MXN
                </Typography>
              </CardContent>
              <Button variant="contained" color="primary" fullWidth>
                Agregar al Carrito
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PaginaCliente;

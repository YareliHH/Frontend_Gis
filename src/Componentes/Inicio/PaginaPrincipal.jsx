import React from 'react';
import { Grid, Card, CardMedia, Container } from '@mui/material';

const images = [
  "https://i.pinimg.com/564x/09/20/1c/09201c1b05f91d5dde2e779d80543536.jpg",
  "https://i.pinimg.com/564x/bd/59/b8/bd59b85c8336650a9254393e2395d073.jpg",
  "https://i.pinimg.com/736x/d9/d4/0e/d9d40e89aa51c7449cd9e50b6a25829f.jpg",
  "https://i.pinimg.com/736x/6d/e7/cc/6de7ccb165aeeb4aca55d92102e512e5.jpg",
  "https://i.pinimg.com/564x/78/cd/7e/78cd7e1b1d841c78e776420790fd6923.jpg",
  "https://i.pinimg.com/564x/48/3a/07/483a073bcb4ddcbf070155828e83c81e.jpg",
  "https://i.pinimg.com/564x/f8/8f/6b/f88f6bbd42440eef70181e0b2e05cee3.jpg",
  "https://i.pinimg.com/564x/81/45/cb/8145cb2cc1fcfcd336bf6c27ab3b685d.jpg",
];

const PaginaPrincipal = () => {
  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Grid container spacing={4}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={`Logo ${index + 1}`}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PaginaPrincipal;

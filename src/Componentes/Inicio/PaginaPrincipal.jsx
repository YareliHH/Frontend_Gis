import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Container } from '@mui/material';

const products = [
  {
    image: "https://i.pinimg.com/564x/09/20/1c/09201c1b05f91d5dde2e779d80543536.jpg",
    price: "$25.00",
  },
  {
    image: "https://i.pinimg.com/564x/bd/59/b8/bd59b85c8336650a9254393e2395d073.jpg",
    price: "$30.00",
  },
  {
    image: "https://i.pinimg.com/736x/d9/d4/0e/d9d40e89aa51c7449cd9e50b6a25829f.jpg",
    price: "$20.00",
  },
  {
    image: "https://i.pinimg.com/736x/6d/e7/cc/6de7ccb165aeeb4aca55d92102e512e5.jpg",
    price: "$22.00",
  },
  {
    image: "https://i.pinimg.com/564x/78/cd/7e/78cd7e1b1d841c78e776420790fd6923.jpg",
    price: "$28.00",
  },
  {
    image: "https://i.pinimg.com/564x/48/3a/07/483a073bcb4ddcbf070155828e83c81e.jpg",
    price: "$35.00",
  },
  {
    image: "https://i.pinimg.com/564x/f8/8f/6b/f88f6bbd42440eef70181e0b2e05cee3.jpg",
    price: "$27.00",
  },
  {
    image: "https://i.pinimg.com/564x/81/45/cb/8145cb2cc1fcfcd336bf6c27ab3b685d.jpg",
    price: "$18.00",
  },
];

const PaginaPrincipal = () => {
  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Grid container spacing={4}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={`Producto ${index + 1}`}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" color="textPrimary">
                  {product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PaginaPrincipal;

import React from 'react';
import { Container, Grid, Typography, IconButton } from '@mui/material';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#00bcd4', color: '#ffffff', padding: '20px', position: 'fixed', width: '100%', bottom: 0 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" textAlign="center" style={{ marginTop: '10px' }}>
          © 2024 Gislive. Todos los derechos reservados.
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;
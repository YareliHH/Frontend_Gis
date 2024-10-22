import React from 'react';
import { Container, Grid, Typography, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#00bcd4', color: '#ffffff', padding: '20px', position: 'fixed', width: '100%', bottom: 0 }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          {/* Atención al Cliente */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Atención al Cliente</Typography>
            <Typography>
              Teléfono: <a href="tel:+1234567890" style={{ color: '#ffffff' }}>7711730977</a><br />
              Correo: <a href="mailto:atencion@gislive.com" style={{ color: '#ffffff' }}>Jehiely_24@hotmail.com</a>
            </Typography>
          </Grid>

          {/* Redes Sociales */}
          <Grid item xs={12} sm={6} textAlign="right">
            <Typography variant="h6">Síguenos en nuestras redes sociales</Typography>
            <IconButton href="https://www.facebook.com" target="_blank" style={{ color: '#ffffff' }}>
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </IconButton>
            <IconButton href="https://www.instagram.com" target="_blank" style={{ color: '#ffffff' }}>
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </IconButton>
            <IconButton href="mailto:atencion@gislive.com" style={{ color: '#ffffff' }}>
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="body2" textAlign="center" style={{ marginTop: '10px' }}>
          © 2024 Gislive. Todos los derechos reservados.
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;

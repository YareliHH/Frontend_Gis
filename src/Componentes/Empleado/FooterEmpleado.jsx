import React from 'react';
import { Typography } from '@mui/material';

const FooterEmpleado = () => {
  return (
    <footer
      style={{
        backgroundColor: '#87CEEB',
        marginTop: '20px',
        color: '#fff',
        padding: '25px',
        width: '100%',
        bottom: 0,
      }}
    >
      <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
        © 2024 Gislive. Todos los derechos reservados.
      </Typography>
    </footer>
  );
};

export default FooterEmpleado;
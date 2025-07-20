import React from 'react';
import { Box } from '@mui/material';

const WhatsAppFloat = () => {
  return (
    <Box
      component="a"
      href="https://api.whatsapp.com/send?phone=%2B522223308869"
      target="_blank"
      aria-label="Chatear por WhatsApp"
      rel="noopener noreferrer"
      sx={{
        position: 'fixed',
        width: '50px', // Reducido de 60px a 50px
        height: '50px', // Reducido de 60px a 50px
        bottom: '20px',
        right: '20px',
        backgroundColor: '#25D366',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, background-color 0.3s',
        '&:hover': {
          backgroundColor: '#1DA851',
          transform: 'scale(1.1)',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: '0 0 0 3px rgba(29, 168, 81, 0.5)',
        },
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="Ícono de WhatsApp"
        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
      />
    </Box>
  );
};

export default WhatsAppFloat;
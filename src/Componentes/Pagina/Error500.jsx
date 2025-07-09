import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import styled from '@emotion/styled';
import robotImage from '../imagenes/robot.png';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Error500 = () => {
  const [isServerDown, setIsServerDown] = useState(false);
  const navigate = useNavigate();  // Usamos navigate para la redirección

  const checkServerStatus = async () => {
    try {
      const response = await fetch('https://backend-gis-1.onrender.com/api/health');
      if (response.ok) {
        setIsServerDown(false);
      } else {
        setIsServerDown(true);
      }
    } catch (error) {
      setIsServerDown(true);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkServerStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isServerDown) {
      // Redirige automáticamente cuando el servidor esté caído
      navigate('/error500');
    }
  }, [isServerDown, navigate]);

  if (isServerDown) {
    return (
      <div style={styles.container}>
        <Image src={robotImage} alt="Robot Error" />
        <Typography variant="h4" style={styles.errorTitle}>Error 500</Typography>
        <Typography variant="h5" style={styles.title}>¡Ups! Algo salió mal.</Typography>
        <Typography style={styles.message}>El servidor ha tenido un error interno. Por favor, inténtalo más tarde.</Typography>
        <Button
          variant="contained"
          style={styles.button}
          onClick={() => window.location.reload()}
        >
          Volver a intentar
        </Button>
      </div>
    );
  }

  return null;  // No se muestra nada si el servidor está funcionando
};

const Image = styled('img')({
  width: '300px',
  height: 'auto',
  marginBottom: '20px',
  animation: 'spin 2s linear infinite',
});

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  errorTitle: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#000000',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#000000',
  },
  message: {
    fontSize: '18px',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#000000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
};

export default Error500;

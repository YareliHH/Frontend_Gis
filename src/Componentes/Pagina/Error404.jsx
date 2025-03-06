import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import styled from '@emotion/styled';
import error404 from '../imagenes/error404.png';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Error404 = () => {
  const [isPageNotFound, setIsPageNotFound] = useState(false);
  const navigate = useNavigate();  // Usamos navigate para la redirección

  const checkPageStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) {
        setIsPageNotFound(false);
      } else {
        setIsPageNotFound(true);
      }
    } catch (error) {
      setIsPageNotFound(true);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkPageStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isPageNotFound) {
      // Redirige automáticamente cuando la página no se encuentre
      navigate('/error404');
    }
  }, [isPageNotFound, navigate]);

  if (isPageNotFound) {
    return (
      <div style={styles.container}>
        <Image src={error404} alt="Robot Error" />
        <Typography variant="h4" style={styles.errorTitle}>Error 404</Typography>
        <Typography variant="h5" style={styles.title}>¡Página no encontrada!</Typography>
        <Typography style={styles.message}>La página que buscas no existe o ha sido movida.</Typography>
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

  return null;  // No se muestra nada si la página está disponible
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

export default Error404;

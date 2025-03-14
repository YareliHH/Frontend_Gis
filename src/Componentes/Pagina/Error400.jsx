import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import styled from '@emotion/styled';
import error400 from '../imagenes/error400.png';  // Cambié la imagen para el error 400
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

const Error400 = () => {
  const [isBadRequest, setIsBadRequest] = useState(false);
  const navigate = useNavigate();  // Usamos navigate para la redirección

  const checkRequestStatus = async () => {
    try {
      const response = await fetch('https://backend-gis-1.onrender.com/api/health');
      if (response.ok) {
        setIsBadRequest(false);
      } else {
        setIsBadRequest(true);
      }
    } catch (error) {
      setIsBadRequest(true);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkRequestStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isBadRequest) {
      // Redirige automáticamente cuando haya un error de solicitud
      navigate('/error400');
    }
  }, [isBadRequest, navigate]);

  if (isBadRequest) {
    return (
      <div style={styles.container}>
        <Image src={error400} alt="Error 400" />
        <Typography variant="h4" style={styles.errorTitle}>Error 400</Typography>
        <Typography variant="h5" style={styles.title}>¡Solicitud Incorrecta!</Typography>
        <Typography style={styles.message}>La solicitud que enviaste no es válida. Por favor, verifica los datos ingresados.</Typography>
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

  return null;  // No se muestra nada si la solicitud es válida
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

export default Error400;

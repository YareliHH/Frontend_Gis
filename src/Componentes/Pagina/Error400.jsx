import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import error400 from '../imagenes/error400.png';
import { useNavigate } from 'react-router-dom';

const Error400 = () => {
  const [isBadRequest, setIsBadRequest] = useState(false);
  const navigate = useNavigate();

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
      navigate('/error400');
    }
  }, [isBadRequest, navigate]);

  const handleGoHome = () => {
    navigate('/'); // Navega a la página de inicio
  };

  if (isBadRequest) {
    return (
      <ErrorContainer>
        <ContentWrapper>
          <StyledImage src={error400} alt="Error 400" />
          <InfoContainer>
            <ErrorCode>Error 400</ErrorCode>
            <ErrorTitle>¡Solicitud Incorrecta!</ErrorTitle>
            <ErrorMessage>
              La solicitud que enviaste no es válida. Por favor, verifica los datos ingresados.
            </ErrorMessage>
            <ButtonContainer>
              <HomeButton
                variant="outlined"
                onClick={handleGoHome}
              >
                Ir al inicio
              </HomeButton>
            </ButtonContainer>
          </InfoContainer>
        </ContentWrapper>
      </ErrorContainer>
    );
  }

  return null;
};

// Animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Componentes con estilos
const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 800px;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const StyledImage = styled.img`
  width: 250px;
  height: auto;
  margin-bottom: 30px;
  animation: ${pulse} 3s infinite ease-in-out;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 40px;
    width: 300px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (min-width: 768px) {
    align-items: flex-start;
    text-align: left;
    max-width: 400px;
  }
`;

const ErrorCode = styled(Typography)`
  font-size: 22px;
  font-weight: 700;
  color: #6c757d;
  margin-bottom: 8px;
`;

const ErrorTitle = styled(Typography)`
  font-size: 36px;
  font-weight: 800;
  color: #343a40;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #007bff, #00c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ErrorMessage = styled(Typography)`
  font-size: 18px;
  color: #495057;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  
  @media (min-width: 576px) {
    flex-direction: row;
  }
`;

const RetryButton = styled(Button)`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  text-transform: none;
  box-shadow: 0 4px 6px rgba(0, 123, 255, 0.25);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #0069d9;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 123, 255, 0.3);
  }
`;

const HomeButton = styled(Button)`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 8px;
  text-transform: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 123, 255, 0.05);
    transform: translateY(-2px);
  }
`;

export default Error400;
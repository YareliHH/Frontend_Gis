// src/componentes/MetodoPago.jsx
import React, { useState } from 'react';
import { 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Card,
  CardContent,
  Fade,
  Chip,
  Divider
} from '@mui/material';
import PayPalIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MetodoPago = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [hoveredMethod, setHoveredMethod] = useState(null);

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pago rápido y seguro con tu cuenta PayPal',
      icon: <PayPalIcon sx={{ fontSize: 32 }} />,
      color: '#0070ba',
      bgColor: '#f0f8ff',
      features: ['Protección del comprador', 'Sin compartir datos bancarios']
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Tarjetas de crédito y débito',
      icon: <CreditCardIcon sx={{ fontSize: 32 }} />,
      color: '#00a8cc',
      bgColor: '#e6f7ff',
      features: ['Hasta 12 cuotas sin interés', 'Todas las tarjetas']
    }
  ];

  const handlePaymentSelect = (methodId) => {
    setSelectedMethod(methodId);
    setTimeout(() => {
      if (methodId === 'paypal') {
        alert('Redirigiendo a PayPal...');
      } else {
        alert('Redirigiendo a Mercado Pago...');
      }
    }, 300);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box textAlign="center" mb={5}>
            <Typography 
              variant="h4" 
              fontWeight="700" 
              mb={2}
              sx={{
                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Método de Pago
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              Elige cómo prefieres realizar tu pago
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <SecurityIcon color="success" fontSize="small" />
              <Typography variant="body2" color="success.main" fontWeight="500">
                Transacciones 100% seguras
              </Typography>
            </Box>
          </Box>

          {/* Payment Methods */}
          <Box display="flex" flexDirection="column" gap={3} mb={4}>
            {paymentMethods.map((method, index) => (
              <Fade in timeout={1000 + index * 200} key={method.id}>
                <Card
                  elevation={selectedMethod === method.id ? 8 : hoveredMethod === method.id ? 6 : 2}
                  onMouseEnter={() => setHoveredMethod(method.id)}
                  onMouseLeave={() => setHoveredMethod(null)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredMethod === method.id ? 'translateY(-4px)' : 'translateY(0)',
                    border: selectedMethod === method.id ? `3px solid ${method.color}` : '3px solid transparent',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${method.color}, ${method.color}90)`,
                      opacity: selectedMethod === method.id ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }
                  }}
                  onClick={() => handlePaymentSelect(method.id)}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" gap={3}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 3,
                          backgroundColor: method.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: method.color,
                          flexShrink: 0
                        }}
                      >
                        {method.icon}
                      </Box>

                      {/* Content */}
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Typography variant="h6" fontWeight="600">
                            {method.name}
                          </Typography>
                          {selectedMethod === method.id && (
                            <CheckCircleIcon color="success" fontSize="small" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          {method.description}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {method.features.map((feature, idx) => (
                            <Chip
                              key={idx}
                              label={feature}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.75rem',
                                height: 24,
                                borderColor: method.color + '40',
                                color: method.color,
                                '&:hover': {
                                  backgroundColor: method.color + '10'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Arrow or Checkmark */}
                      <Box
                        sx={{
                          opacity: hoveredMethod === method.id || selectedMethod === method.id ? 1 : 0.3,
                          transition: 'opacity 0.3s ease',
                          color: method.color
                        }}
                      >
                        {selectedMethod === method.id ? (
                          <CheckCircleIcon fontSize="large" />
                        ) : (
                          <Box
                            sx={{
                              width: 0,
                              height: 0,
                              borderLeft: '12px solid currentColor',
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>

          {/* Continue Button */}
          <Fade in timeout={1600}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    Método seleccionado
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {selectedMethod 
                      ? paymentMethods.find(m => m.id === selectedMethod)?.name 
                      : 'Ninguno seleccionado'
                    }
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  disabled={!selectedMethod}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: selectedMethod 
                      ? 'linear-gradient(45deg, #2196F3, #21CBF3)' 
                      : undefined,
                    '&:hover': {
                      background: selectedMethod 
                        ? 'linear-gradient(45deg, #1976D2, #1BA3D3)' 
                        : undefined,
                    }
                  }}
                >
                  Continuar con el pago
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Fade>
    </Container>
  );
};

export default MetodoPago;
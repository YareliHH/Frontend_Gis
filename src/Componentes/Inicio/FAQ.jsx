import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PreguntasFrecuentes = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        position: 'relative', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center', 
        padding: '20px' 
      }}
    >
      {/* Fondo de la imagen */}
      <Box
        
      />

      {/* Título principal */}
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 4, color: 'black' }}>
        Preguntas Frecuentes
      </Typography>

      {/* Pregunta 1 */}
      <Accordion sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant="h6" sx={{ width: '100%', color: 'black' }}>
            ¿Qué tipos de uniformes clínicos ofrecen?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ color: 'black' }}>
            Ofrecemos una amplia variedad de uniformes clínicos, incluyendo batas médicas, gorros quirúrgicos, guantes, mascarillas y más.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Pregunta 2 */}
      <Accordion sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography variant="h6" sx={{ width: '100%', color: 'black' }}>
            ¿Cómo puedo realizar un pedido?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ color: 'black' }}>
            Realiza tu pedido seleccionando los productos en nuestra tienda en línea y agregándolos al carrito. Luego, procede con el pago de forma segura.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Pregunta 3 */}
      <Accordion sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography variant="h6" sx={{ width: '100%', color: 'black' }}>
            ¿Cuáles son los métodos de pago disponibles?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ color: 'black' }}>
            Aceptamos diversos métodos de pago, como tarjetas de crédito, transferencias bancarias y pagos a través de plataformas como PayPal.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Pregunta 4 */}
      <Accordion sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <Typography variant="h6" sx={{ width: '100%', color: 'black' }}>
            ¿Cuánto cuesta el envío?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ color: 'black' }}>
            El costo del envío depende de la ubicación de destino y el peso total de los productos.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Pregunta 5 */}
      <Accordion sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          <Typography variant="h6" sx={{ width: '100%', color: 'black' }}>
            ¿Tienen uniformes para diferentes especialidades médicas?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" sx={{ color: 'black' }}>
            Sí, ofrecemos uniformes diseñados específicamente para distintas especialidades médicas, como cirugía, atención dental, enfermería y más.
          </Typography>
        </AccordionDetails>
      </Accordion>

    </Box>
  );
};

export default PreguntasFrecuentes;

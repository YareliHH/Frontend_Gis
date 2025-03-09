import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const preguntas = [
  {
    pregunta: "🩺 ¿Qué tipos de uniformes clínicos ofrecen?",
    respuesta:
      "Ofrecemos una amplia variedad de uniformes clínicos y quirúrgicos, incluyendo batas médicas con diferentes especialidades",
  },
  {
    pregunta: "🛒 ¿Cómo puedo realizar un pedido?",
    respuesta:
      "Realiza tu pedido seleccionando los productos en nuestra tienda en línea y agregándolos al carrito. Luego, procede con el pago de forma segura.",
  },
  {
    pregunta: "💳 ¿Cuáles son los métodos de pago disponibles?",
    respuesta:
      "Aceptamos diversos métodos de pago, como tarjetas de crédito, transferencias bancarias y pagos a través de plataformas como PayPal.",
  },
  {
    pregunta: "📦 ¿Cuánto cuesta el envío?",
    respuesta:
      "El costo del envío depende de la ubicación de destino y el peso total de los productos.",
  },
  {
    pregunta: "👩‍⚕️ ¿Tienen uniformes para diferentes especialidades médicas?",
    respuesta:
      "Sí, ofrecemos uniformes diseñados específicamente para distintas especialidades médicas, como cirugía, atención dental, enfermería y más.",
  },
];

const PreguntasFrecuentes = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Sección con fondo atractivo */}
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #00bfa5,rgb(159, 224, 217))",
          color: "white",
          textAlign: "center",
        }}
      >
        {/* Título con animación */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            ❓ Preguntas Frecuentes
          </Typography>
          <Typography variant="subtitle1">
            Encuentra respuestas a las dudas más comunes sobre nuestra tienda.
          </Typography>
        </motion.div>
      </Paper>

      {/* Preguntas y respuestas con animaciones */}
      <Box sx={{ mt: 4 }}>
        {preguntas.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Accordion
              sx={{
                mb: 2,
                borderRadius: "12px",
                backgroundColor: "white",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00bfa5" }} />}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#00897b" }}>
                  {item.pregunta}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ color: "#444" }}>
                  {item.respuesta}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Box>
    </Container>
  );
};

export default PreguntasFrecuentes;

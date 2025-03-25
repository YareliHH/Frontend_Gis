import React, { useEffect, useState } from "react";
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
import axios from "axios"; // Importar axios para hacer la solicitud

const PreguntasFrecuentes = () => {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/faqs");
        setPreguntas(response.data); // Guardar datos en el estado
      } catch (error) {
        console.error("Error al obtener preguntas frecuentes:", error);
      }
    };

    fetchPreguntas();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #00bfa5, rgb(159, 224, 217))",
          color: "white",
          textAlign: "center",
        }}
      >
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

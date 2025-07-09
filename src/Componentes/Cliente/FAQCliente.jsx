import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00bfa5", // Teal for primary actions
    },
    secondary: {
      main: "#1565c0", // Blue for secondary elements
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#1a3c34",
      textAlign: "center",
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
    },
    h6: {
      fontWeight: 600,
      color: "#1565c0",
      textAlign: "center",
    },
    body1: {
      color: "#37474f",
      lineHeight: 1.7,
      textAlign: "center",
    },
    subtitle1: {
      color: "#546e7a",
      fontSize: "1.1rem",
      textAlign: "center",
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          marginBottom: "16px",
          boxShadow: "0 8px 24px rgba(0, 191, 165, 0.15)",
          border: "1px solid rgba(0, 191, 165, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 32px rgba(0, 191, 165, 0.25)",
            transform: "translateY(-4px)",
          },
          "&:before": {
            display: "none",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
          background: "linear-gradient(135deg, rgba(0, 191, 165, 0.05), rgba(21, 101, 192, 0.05))",
          justifyContent: "center",
          "&:hover": {
            background: "linear-gradient(135deg, rgba(0, 191, 165, 0.1), rgba(21, 101, 192, 0.08))",
          },
        },
        content: {
          justifyContent: "center",
          textAlign: "center",
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        },
        expandIconWrapper: {
          color: "#00bfa5",
          fontSize: "1.8rem",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "24px",
          backgroundColor: "rgba(0, 191, 165, 0.03)",
          borderTop: "1px solid rgba(0, 191, 165, 0.1)",
          textAlign: "center",
        },
      },
    },
  },
});

const PreguntasFrecuentes = () => {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await axios.get("https://backend-gis-1.onrender.com/api/faqs");
        setPreguntas(response.data);
      } catch (error) {
        console.error("Error al obtener preguntas frecuentes:", error);
      }
    };
    fetchPreguntas();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e0f7fa 0%, #e6e6fa 50%, #e8f5e9 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography variant="h2" gutterBottom>
                Preguntas Frecuentes
              </Typography>
              <Typography variant="subtitle1" sx={{ maxWidth: "500px", mx: "auto" }}>
                Encuentra respuestas a las preguntas más comunes sobre nuestros servicios.
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto" }}>
            {preguntas.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Accordion>
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
                      {item.pregunta}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {item.respuesta}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>

          {/* Decorative Elements */}
          <Box
            sx={{
              position: "fixed",
              top: "15%",
              right: "5%",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(0, 191, 165, 0.1), rgba(21, 101, 192, 0.1))",
              zIndex: -1,
              animation: "float 6s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
                "50%": { transform: "translateY(-20px) rotate(180deg)" },
              },
            }}
          />
          <Box
            sx={{
              position: "fixed",
              bottom: "15%",
              left: "5%",
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(21, 101, 192, 0.1), rgba(0, 191, 165, 0.1))",
              zIndex: -1,
              animation: "float 8s ease-in-out infinite reverse",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
                "50%": { transform: "translateY(-15px) rotate(-180deg)" },
              },
            }}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PreguntasFrecuentes;
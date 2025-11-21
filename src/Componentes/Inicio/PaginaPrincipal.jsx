// PaginaPrincipalMejorada.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";

// Iconos
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import MyLocationIcon from "@mui/icons-material/MyLocation";

// Imágenes del carrusel
import img1 from "../imagenes/img1.jpg";
import img2 from "../imagenes/img2.jpg";
import img3 from "../imagenes/img3.jpg";
import img4 from "../imagenes/img4.jpg";
import img5 from "../imagenes/img5.jpg";
import img6 from "../imagenes/img6.jpg";

const PaginaPrincipalMejorada = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentImage, setCurrentImage] = useState(0);
  const [userCoords, setUserCoords] = useState(null);

  const images = [img1, img2, img3, img4, img5, img6];

  // Carrusel automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Solicitar ubicación con modal nativo del navegador
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        if (error.code === 1) {
          alert("Permiso de ubicación denegado");
        } else {
          alert("No se pudo obtener tu ubicación");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 56, color: "white" }} />,
      title: "Envío Rápido",
      description: "Entrega segura en 24-48 horas con seguimiento completo",
      gradient: "linear-gradient(135deg, #40E0D0 0%, #2C7A7B 100%)",
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 56, color: "white" }} />,
      title: "Calidad Garantizada",
      description: "Productos certificados con garantía total de satisfacción",
      gradient: "linear-gradient(135deg, #4ECDC4 0%, #38B2AC 100%)",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 56, color: "white" }} />,
      title: "Soporte Especializado",
      description: "Equipo médico profesional disponible para asesorarte",
      gradient: "linear-gradient(135deg, #81E6D9 0%, #4FD1C7 100%)",
    },
    {
      icon: <PriceCheckIcon sx={{ fontSize: 56, color: "white" }} />,
      title: "Precios Competitivos",
      description: "Las mejores tarifas del mercado sin comprometer calidad",
      gradient: "linear-gradient(135deg, #B2F5EA 0%, #68D391 100%)",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAFAFA" }}>
      {/* HERO */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #40E0D0 0%, #2C7A7B 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.2)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, py: 8 }}>
          <Grid container spacing={8} alignItems="center" sx={{ minHeight: "80vh" }}>
            <Grid item xs={12} lg={6}>
              <Box sx={{ textAlign: { xs: "center", lg: "left" } }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "3rem", md: "4rem", lg: "5rem" },
                    fontWeight: 800,
                    color: "white",
                    mb: 3,
                    lineHeight: 0.9,
                  }}
                >
                  GisLive
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      background: "linear-gradient(45deg, #4ECDC4 0%, #40E0D0 100%)",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Boutique
                  </Box>
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.3rem", md: "1.8rem" },
                    color: "rgba(255,255,255,0.9)",
                    mb: 5,
                    fontWeight: 300,
                  }}
                >
                  Especialistas en equipamiento clínico y quirúrgico de alta precisión
                </Typography>

                <Button
                  component={Link}
                  to="/contacto"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: "50px",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      borderColor: "white",
                      background: "rgba(255,255,255,0.2)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  Contactar Ahora
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "30px",
                    overflow: "hidden",
                    p: 2,
                    backdropFilter: "blur(20px)",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Box
                    sx={{
                      height: { xs: 350, sm: 450, md: 520 },
                      width: { xs: 320, sm: 420, md: 480 },
                      borderRadius: "24px",
                      background: "white",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={images[currentImage]}
                      alt="Producto GisLive"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "20px",
                        transition: "opacity 0.8s ease-in-out",
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box sx={{ py: 15, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              ¿Por qué elegir{" "}
              <span
                style={{
                  background: "linear-gradient(45deg, #40E0D0 0%, #2C7A7B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                GisLive?
              </span>
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{
                    borderRadius: "24px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-8px)" },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: "24px",
                        background: f.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 4,
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={700}>{f.title}</Typography>
                    <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
                      {f.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* UBICACIÓN */}
      <Box sx={{ py: 15, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h2" fontWeight={700}>
              Nuestra{" "}
              <span
                style={{
                  background: "linear-gradient(45deg, #40E0D0 0%, #4ECDC4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ubicación
              </span>
            </Typography>
            <Typography variant="h5" sx={{ color: "#666", mt: 2 }}>
              Visítanos o contáctanos para una atención personalizada
            </Typography>
          </Box>

          {/* Botón Mi Ubicación */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<MyLocationIcon />}
              onClick={requestLocation}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: "50px",
                background: "linear-gradient(135deg, #40E0D0 0%, #2C7A7B 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4ECDC4 0%, #38B2AC 100%)",
                },
              }}
            >
              Ver mi ubicación
            </Button>
          </Box>

          <Grid container spacing={6} alignItems="flex-start">
            {/* MAPA */}
            <Grid item xs={12} lg={8}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "450px", md: "600px" },
                  borderRadius: "28px",
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                }}
              >
                {userCoords ? (
                  <iframe
                    title="Tu ubicación"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${userCoords.lat},${userCoords.lng}&output=embed&z=15`}
                    style={{ border: 0 }}
                  />
                ) : (
                  <iframe
                    title="GisLive Boutique - Huejutla de Reyes"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!3m2!1ses!2smx!4v1738279572591!5m2!1ses!2smx!6m8!1m7!1sfptv_59OOGwWnICTLujcAQ!2m2!1d21.14024956987548!2d-98.42112377080686!3f282.3148371518607!4f7.436404529233116!5f0.7820865974627469"
                    style={{ border: 0 }}
                  />
                )}
              </Box>
            </Grid>

            {/* TARJETAS DE CONTACTO */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <Card sx={{ borderRadius: "24px", background: "linear-gradient(135deg, #40E0D0, #2C7A7B)", color: "white" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationOnIcon sx={{ fontSize: 32, mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">Dirección</Typography>
                    </Box>
                    <Typography>
                      Velázquez Ibarra #12<br />
                      Centro, Huejutla de Reyes, Hidalgo<br />
                      México, CP 43000
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: "24px", background: "linear-gradient(135deg, #4ECDC4, #38B2AC)", color: "white" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PhoneIcon sx={{ fontSize: 32, mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">Teléfonos</Typography>
                    </Box>
                    <Typography>
                      789 896 4861<br />
                      222 330 8869
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: "24px", background: "linear-gradient(135deg, #81E6D9, #4FD1C7)", color: "white" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <EmailIcon sx={{ fontSize: 32, mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">Correo</Typography>
                    </Box>
                    <Typography>gislive17@gmail.com</Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default PaginaPrincipalMejorada;
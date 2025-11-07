"use client"

import { useState, useEffect } from "react"
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
  Stack
} from "@mui/material"
import { Link } from "react-router-dom"

// Icons
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import PriceCheckIcon from "@mui/icons-material/PriceCheck"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"

// Componentes
import Geocalizacion from "./geocalizacion.jsx"

// Importar imágenes locales
import img1 from "../imagenes/img1.jpg"
import img2 from "../imagenes/img2.jpg"
import img3 from "../imagenes/img3.jpg"
import img4 from "../imagenes/img4.jpg"
import img5 from "../imagenes/img5.jpg"
import img6 from "../imagenes/img6.jpg"

const PaginaPrincipalMejorada = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [currentImage, setCurrentImage] = useState(0)

  const images = [img1, img2, img3, img4, img5, img6]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 56, color: "white" }} />,
      title: "Envío Rápido",
      description: "Entrega segura en 24-48 horas con seguimiento completo",
      gradient: "linear-gradient(135deg, #40E0D0 0%, #2C7A7B 100%)"
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 56, color: "white" }} />,
      title: "Calidad Garantizada",
      description: "Productos certificados con garantía total de satisfacción",
      gradient: "linear-gradient(135deg, #4ECDC4 0%, #38B2AC 100%)"
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 56, color: "white" }} />,
      title: "Soporte Especializado",
      description: "Equipo médico profesional disponible para asesorarte",
      gradient: "linear-gradient(135deg, #81E6D9 0%, #4FD1C7 100%)"
    },
    {
      icon: <PriceCheckIcon sx={{ fontSize: 56, color: "white" }} />,
      title: "Precios Competitivos",
      description: "Las mejores tarifas del mercado sin comprometer calidad",
      gradient: "linear-gradient(135deg, #B2F5EA 0%, #68D391 100%)"
    }
  ]

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAFAFA" }}>
      
      {/* Hero Section */}
      <Box sx={{
        background: "linear-gradient(135deg, #40E0D0 0%, #2C7A7B 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.2)",
          zIndex: 1
        }
      }}>
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, py: 8 }}>
          <Grid container spacing={8} alignItems="center" sx={{ minHeight: "80vh" }}>
            
            {/* Contenido principal */}
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
                    letterSpacing: "-0.02em"
                  }}
                >
                  GisLive
                  <Box component="span" sx={{
                    display: "block",
                    background: "linear-gradient(45deg, #4ECDC4 0%, #40E0D0 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    Boutique
                  </Box>
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.3rem", md: "1.8rem" },
                    color: "rgba(255, 255, 255, 0.9)",
                    mb: 5,
                    lineHeight: 1.4,
                    fontWeight: 300,
                    maxWidth: "600px",
                    mx: { xs: "auto", lg: 0 }
                  }}
                >
                  Especialistas en equipamiento clínico y quirúrgico de alta precisión para profesionales de la salud
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  sx={{ justifyContent: { xs: "center", lg: "flex-start" } }}
                >
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
                      textTransform: "none",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                      background: "rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        borderColor: "white",
                        background: "rgba(255, 255, 255, 0.2)",
                        transform: "translateY(-2px)"
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    Contactar Ahora
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Carrusel de imágenes */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ position: "relative", display: "flex", justifyContent: "center", mt: { xs: 6, lg: 0 } }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "30px",
                    overflow: "hidden",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    p: 2
                  }}
                >
                  <Box sx={{
                    height: { xs: 350, sm: 450, md: 500 },
                    width: { xs: 300, sm: 400, md: 450 },
                    borderRadius: "24px",
                    overflow: "hidden",
                    position: "relative",
                    background: "white"
                  }}>
                    <Box
                      component="img"
                      src={images[currentImage]}
                      alt={`Producto médico ${currentImage + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        p: 3,
                        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                    />
                    <Box sx={{
                      position: "absolute",
                      bottom: 20,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 1
                    }}>
                      {images.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: currentImage === index ? 24 : 8,
                            height: 8,
                            borderRadius: "4px",
                            background: currentImage === index
                              ? "linear-gradient(45deg, #4ECDC4 0%, #40E0D0 100%)"
                              : "rgba(0,0,0,0.2)",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                color: "#1a1a1a",
                mb: 3,
                letterSpacing: "-0.02em"
              }}
            >
              ¿Por qué elegir
              <Box component="span" sx={{
                background: "linear-gradient(45deg, #40E0D0 0%, #2C7A7B 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                ml: 2
              }}>
                GisLive?
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#666",
                maxWidth: "700px",
                mx: "auto",
                lineHeight: 1.6,
                fontWeight: 300
              }}
            >
              Ofrecemos una experiencia integral en equipamiento médico con los más altos estándares de calidad y servicio profesional
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "24px",
                    background: "white",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 30px 80px rgba(0,0,0,0.12)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 5, textAlign: "center" }}>
                    <Box sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "24px",
                      background: feature.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px auto",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.15)"
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a1a", mb: 2, fontSize: "1.3rem" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.7, fontSize: "1rem" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                color: "#1a1a1a",
                mb: 3,
                letterSpacing: "-0.02em"
              }}
            >
              Nuestra
              <Box component="span" sx={{
                background: "linear-gradient(45deg, #40E0D0 0%, #4ECDC4 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                ml: 2
              }}>
                Ubicación
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#666", maxWidth: "600px", mx: "auto", lineHeight: 1.6, fontWeight: 300 }}
            >
              Visítanos o contáctanos para una atención personalizada
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {/* Mapa */}
            <Grid item xs={12} lg={8}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  height: { xs: 350, md: 500 },
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)"
                }}
              >
                <Geocalizacion lat={21.140249} lng={-98.421124} zoom={15} width="100%" height="100%" />
              </Paper>
            </Grid>

            {/* Información de Contacto */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <Card sx={{ borderRadius: "20px", background: "linear-gradient(135deg, #40E0D0 0%, #2C7A7B 100%)", color: "white", boxShadow: "0 16px 40px rgba(64, 224, 208, 0.3)" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationOnIcon sx={{ fontSize: 32, mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">Dirección</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, opacity: 0.9 }}>
                      Velázques Ibarra #12<br />Col. Centro<br />Huejutla de Reyes<br />México, CP 43000
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: "20px", background: "linear-gradient(135deg, #4ECDC4 0%, #38B2AC 100%)", color: "white", boxShadow: "0 16px 40px rgba(76, 205, 196, 0.3)" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PhoneIcon sx={{ fontSize: 32, mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">Teléfono</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, opacity: 0.9 }}>
                      789 896 4861<br />222 330 8869
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: "20px", background: "linear-gradient(135deg, #81E6D9 0%, #4FD1C7 100%)", color: "white", boxShadow: "0 16px 40px rgba(129, 230, 217, 0.3)" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <EmailIcon sx={{ fontSize: 32, mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">Email</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>gislive17@gmail.com</Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default PaginaPrincipalMejorada

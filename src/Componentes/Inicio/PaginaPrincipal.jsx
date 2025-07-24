"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Paper,
  Divider,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  TextField,
  Fade,
  Avatar,
  Card,
  CardContent,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion } from "framer-motion"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Icons
import ChatIcon from "@mui/icons-material/Chat"
import CloseIcon from "@mui/icons-material/Close"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import PriceCheckIcon from "@mui/icons-material/PriceCheck"
import StarIcon from "@mui/icons-material/Star"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"

// Importar las imágenes locales de los productos
import img1 from "../imagenes/img1.jpg"
import img2 from "../imagenes/img2.jpg"
import img3 from "../imagenes/img3.jpg"
import img4 from "../imagenes/img4.jpg"
import img5 from "../imagenes/img5.jpg"
import img6 from "../imagenes/img6.jpg"

// Componentes estilizados
const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  borderRadius: "12px",
  padding: "12px 32px",
  fontSize: "1rem",
  fontFamily: "Montserrat, sans-serif",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(64, 224, 208, 0.3)",
  background: "linear-gradient(135deg, #40E0D0 0%, #4ECDC4 100%)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(135deg, #37BFBF 0%, #45B7B8 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(64, 224, 208, 0.4)",
  },
}))

const CategoryTag = styled(Box)(({ theme, bgcolor, color }) => ({
  display: "inline-block",
  padding: "8px 20px",
  borderRadius: "25px",
  backgroundColor: bgcolor || "rgba(64, 224, 208, 0.1)",
  color: color || "#2C7A7B",
  fontSize: "0.875rem",
  fontWeight: 600,
  marginBottom: "16px",
  fontFamily: "Montserrat, sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}))

const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "80px",
  height: "80px",
  borderRadius: "20px",
  backgroundColor: bgcolor || "rgba(64, 224, 208, 0.1)",
  marginBottom: "24px",
  transition: "all 0.3s ease",
  "& svg": {
    fontSize: "2.5rem",
  },
  "&:hover": {
    transform: "scale(1.1) rotate(5deg)",
  },
}))

const FeatureCard = styled(Card)(({ theme, bordercolor }) => ({
  border: "none",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: "20px",
  overflow: "hidden",
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    boxShadow: "0 20px 40px rgba(64, 224, 208, 0.2)",
    transform: "translateY(-10px)",
  },
  "& .MuiCardContent-root": {
    padding: "32px",
  },
  "&::before": {
    content: '""',
    display: "block",
    height: "4px",
    background: `linear-gradient(90deg, ${bordercolor || "#40E0D0"} 0%, ${bordercolor || "#4ECDC4"} 100%)`,
    width: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%", // Tarjetas más anchas en móvil
  },
}))

const GradientBox = styled(Box)(({ theme, from, to }) => ({
  background: `linear-gradient(135deg, ${from || "#F7FAFC"} 0%, ${to || "white"} 100%)`,
  padding: { xs: "40px 0", md: "80px 0" }, // Reducir padding en móvil
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%2340E0D0" fillOpacity="0.03"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.5,
  },
}))

const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: { xs: "auto", md: "70vh" }, // Ajuste para móvil
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
}))

const TestimonialCard = styled(Card)(({ theme }) => ({
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%", // Tarjetas más anchas en móvil
  },
}))

const SliderImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: { xs: "280px", sm: "350px", md: "450px" }, // Ajuste de altura para móvil
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f8f9fa",
  overflow: "hidden",
  "& img": {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "0",
    transition: "transform 0.3s ease",
  },
  "&:hover img": {
    transform: "scale(1.05)",
  },
}))

const PaginaPrincipalMejorada = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([{ text: "¡Hola! ¿En qué puedo ayudarte hoy?", sender: "bot" }])
  const [inputMessage, setInputMessage] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const toggleChat = () => setChatOpen(!chatOpen)
  const toggleMenu = () => setMenuOpen(!menuOpen)

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages([...messages, { text: inputMessage, sender: "user" }])
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Gracias por contactarnos. Un agente se comunicará contigo pronto.", sender: "bot" },
        ])
      }, 1000)
      setInputMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage()
  }

  const addToCart = () => setCartItems(cartItems + 1)

  const images = [img1, img2, img3, img4, img5, img6]

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: !isMobile,
    fade: false,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    dotsClass: "slick-dots custom-dots",
    customPaging: (i) => (
      <div
        style={{
          width: "14px",
          height: "14px",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "50%",
          transition: "all 0.3s ease",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          cursor: "pointer",
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  }

  const menuItems = ["Inicio", "Productos", "Clínicos", "Quirúrgicos", "Ofertas", "Contacto"]

  const whyChooseUs = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#40E0D0" }} />,
      title: "Envío Express",
      description:
        "Entrega rápida y segura en 24-48 horas. Tu compra llegará en perfectas condiciones con seguimiento en tiempo real.",
      color: "#40E0D0",
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: "#667eea" }} />,
      title: "Garantía de Calidad",
      description:
        "Productos de la más alta calidad con garantía de satisfacción. Si no estás satisfecho, te devolvemos tu dinero.",
      color: "#667eea",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#f093fb" }} />,
      title: "Atención 24/7",
      description:
        "Nuestro equipo de expertos está disponible para asesorarte en todo momento. Te ayudamos a encontrar lo que buscas.",
      color: "#f093fb",
    },
    {
      icon: <PriceCheckIcon sx={{ fontSize: 40, color: "#4facfe" }} />,
      title: "Precios Únicos",
      description:
        "Los mejores precios del mercado sin comprometer la calidad. Ofertas exclusivas y descuentos especiales.",
      color: "#4facfe",
    },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Cliente Frecuente",
      text: "La calidad de los productos es excepcional. Siempre quedo satisfecha con la atención.",
      rating: 5,
      avatar: "https://img.freepik.com/foto-gratis/mujer-joven-hermosa-sueter-rosa-calido-aspecto-natural-sonriente-retrato-aislado-cabello-largo_285396-896.jpg",
    },
    {
      name: "Carlos Rodríguez",
      role: "Médico",
      text: "Productos clínicos de primera calidad. Los recomiendo ampliamente para uso profesional.",
      rating: 5,
      avatar: "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/5KCVGAGSP5HFJA7KMALNP7ITS4.jpg",
    },
    {
      name: "Ana Martínez",
      role: "Enfermera",
      text: "Excelente servicio y productos de calidad. La entrega siempre es puntual.",
      rating: 5,
      avatar: "https://d5tnfl9agh5vb.cloudfront.net/uploads/2016/11/que-hace-una-enfermera.jpg",
    },
  ]

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#FFFFFF", position: "relative" }}>
      {/* Mobile menu drawer */}
      <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
        <Box sx={{ width: 280, background: "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)" }}>
          <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src="/placeholder.svg?height=50&width=50" sx={{ width: 50, height: 50 }} />
            <Typography variant="h6" sx={{ fontFamily: "Montserrat, sans-serif", color: "white", fontWeight: "bold" }}>
              GisLive Boutique
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
          <List>
            {menuItems.map((text, index) => (
              <Fade in={menuOpen} style={{ transitionDelay: `${index * 100}ms` }} key={text}>
                <ListItem button sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              </Fade>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: { xs: 4, md: 0 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2rem", md: "3.5rem", lg: "4rem" }, // Ajuste para móvil
                    fontWeight: "bold",
                    color: "white",
                    mb: 3,
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  GisLive Boutique
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.5rem" }, // Ajuste para móvil
                    color: "rgba(255, 255, 255, 0.9)",
                    mb: 4,
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  Descubre la elegancia y calidad en cada producto. Especialistas en productos clínicos y quirúrgicos.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Paper
                  elevation={10}
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    background: "white",
                  }}
                >
                  <Slider {...sliderSettings}>
                    {images.map((img, index) => (
                      <SliderImageContainer key={index}>
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Producto ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "contain",
                            padding: "20px",
                            backgroundColor: "white",
                          }}
                        />
                      </SliderImageContainer>
                    ))}
                  </Slider>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Why Choose Us Section */}
      <GradientBox from="#F7FAFC" to="white">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <CategoryTag bgcolor="rgba(64, 224, 208, 0.1)" color="#2C7A7B">
              Nuestra Diferencia
            </CategoryTag>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "3rem" }, // Ajuste para móvil
                fontWeight: "bold",
                color: "#2D3748",
                mb: 3,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              ¿Por qué elegirnos?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#718096",
                maxWidth: "600px",
                mx: "auto",
                fontFamily: "Montserrat, sans-serif",
                lineHeight: 1.6,
              }}
            >
              En GisLive Boutique ofrecemos productos de alta calidad, servicio excepcional y precios competitivos.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {whyChooseUs.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <FeatureCard bordercolor={item.color}>
                    <CardContent sx={{ textAlign: "center", height: "100%", display: "flex", flexDirection: "column" }}>
                      <IconWrapper bgcolor={`${item.color}15`}>{item.icon}</IconWrapper>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#2D3748",
                          mb: 2,
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#718096",
                          fontFamily: "Montserrat, sans-serif",
                          lineHeight: 1.6,
                          flexGrow: 1,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </GradientBox>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, background: "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <CategoryTag bgcolor="rgba(255,255,255,0.2)" color="white">
              Experiencias
            </CategoryTag>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "3rem" }, // Ajuste para móvil
                fontWeight: "bold",
                color: "white",
                mb: 3,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Lo que dicen nuestros clientes
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.9)",
                maxWidth: "600px",
                mx: "auto",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Conoce las experiencias de quienes confían en nosotros
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <TestimonialCard>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Avatar
                          src={testimonial.avatar}
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 2,
                            border: "3px solid #40E0D0",
                            boxShadow: "0 4px 15px rgba(64, 224, 208, 0.3)",
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "#2D3748", fontFamily: "Montserrat, sans-serif" }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#718096", fontFamily: "Montserrat, sans-serif" }}>
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} sx={{ color: "#F6AD55", fontSize: "1.2rem" }} />
                        ))}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: "italic",
                          color: "#4A5568",
                          fontFamily: "Montserrat, sans-serif",
                          lineHeight: 1.6,
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                    </CardContent>
                  </TestimonialCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Location Section */}
      <GradientBox from="white" to="#F7FAFC">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <CategoryTag bgcolor="rgba(64, 224, 208, 0.1)" color="#2C7A7B">
              Ubicación
            </CategoryTag>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "3rem" }, // Ajuste para móvil
                fontWeight: "bold",
                color: "#2D3748",
                mb: 3,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Encuéntranos
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#718096",
                maxWidth: "600px",
                mx: "auto",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Visítanos o contáctanos para más información
            </Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} lg={8}>
              <Paper
                elevation={10}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  height: { xs: 300, md: 500 }, // Ajuste para móvil
                }}
              >
                <iframe
                  title="Ubicación GisLive Boutique"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps/embed?pb=!3m2!1ses!2smx!4v1738279572591!5m2!1ses!2smx!6m8!1m7!1sfptv_59OOGwWnICTLujcAQ!2m2!1d21.14024956987548!2d-98.42112377080686!3f282.3148371518607!4f7.436404529233116!5f0.7820865974627469"
                  allowFullScreen
                />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
                <FeatureCard bordercolor="#40E0D0">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationOnIcon sx={{ color: "#40E0D0", mr: 2, fontSize: "2rem" }} />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#2D3748", fontFamily: "Montserrat, sans-serif" }}
                      >
                        Dirección
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "#718096", fontFamily: "Montserrat, sans-serif" }}>
                      Velázques Ibarra, #12, Col.Centro, Huejutla de Reyes Centro, México, 43000
                    </Typography>
                  </CardContent>
                </FeatureCard>
                <FeatureCard bordercolor="#f093fb">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PhoneIcon sx={{ color: "#f093fb", mr: 2, fontSize: "2rem" }} />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#2D3748", fontFamily: "Montserrat, sans-serif" }}
                      >
                        Contacto
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "#718096", fontFamily: "Montserrat, sans-serif", mb: 1 }}>
                      Tel: 7898964861 ó 2223308869
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#718096", fontFamily: "Montserrat, sans-serif" }}>
                      Email: gislive17@gmail.com
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </GradientBox>

      {/* Chat Button */}
      <IconButton
        onClick={toggleChat}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "linear-gradient(135deg, #40E0D0 0%, #4ECDC4 100%)",
          color: "white",
          width: 60,
          height: 60,
          boxShadow: "0 8px 25px rgba(64, 224, 208, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #37BFBF 0%, #45B7B8 100%)",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
      >
        <ChatIcon sx={{ fontSize: "1.8rem" }} />
      </IconButton>

      {/* Chat Window */}
      {chatOpen && (
        <Paper
          elevation={10}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: { xs: "85vw", sm: 350 }, // Ajuste para móvil
            height: { xs: 300, sm: 400 }, // Reducir altura en móvil
            borderRadius: "20px",
            overflow: "hidden",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #40E0D0 0%, #4ECDC4 100%)",
              color: "white",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}>
              Chat de Ayuda
            </Typography>
            <IconButton onClick={toggleChat} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", backgroundColor: "#F7FAFC" }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: "80%",
                    backgroundColor: message.sender === "user" ? "#40E0D0" : "white",
                    color: message.sender === "user" ? "white" : "#2D3748",
                    borderRadius: "15px",
                  }}
                >
                  <Typography variant="body2" sx={{ fontFamily: "Montserrat, sans-serif" }}>
                    {message.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 2, backgroundColor: "white", borderTop: "1px solid #E2E8F0" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe tu mensaje..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    fontFamily: "Montserrat, sans-serif",
                  },
                }}
              />
              <StyledButton variant="contained" onClick={sendMessage} sx={{ minWidth: "auto", px: 2 }}>
                Enviar
              </StyledButton>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default PaginaPrincipalMejorada
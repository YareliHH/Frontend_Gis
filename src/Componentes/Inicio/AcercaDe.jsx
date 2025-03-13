import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemIcon, ListItemText, Fade, Zoom, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MissionIcon from '@mui/icons-material/EmojiFlags';
import VisionIcon from '@mui/icons-material/Visibility';
import ValuesIcon from '@mui/icons-material/Stars';

const AcercaDe = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animated, setAnimated] = useState(false);

    const colors = {
        primaryText: '#000000',
        highlightText: '#1565C0', // Azul para resaltar títulos en hover
        misionCard: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
        visionCard: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        valuesCard: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        iconColor: '#0d47a1',
        textHover: '#1976D2' // Color para los textos cuando el cursor está encima
    };

    useEffect(() => {
        fetch('http://localhost:3001/api/acerca_de')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Datos recibidos:', data); // Verifica los datos en la consola
                setData(data[0]); // Actualiza el estado con el primer registro
                setLoading(false); // Indica que la carga ha terminado
                // Activar animaciones después de cargar datos
                setTimeout(() => setAnimated(true), 300);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError(error.message); // Actualiza el estado de error
                setLoading(false); // Indica que la carga ha terminado
            });
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <CircularProgress 
                    size={60} // Tamaño del ícono
                    thickness={4} // Grosor de la línea
                    sx={{ 
                        color: colors.highlightText, // Color del ícono
                        animationDuration: '1.5s', // Velocidad de la animación
                    }} 
                />
                <Typography variant="h6" sx={{ mt: 2, color: colors.primaryText }}>
                    Cargando...
                </Typography>
            </Box>
        );
    }
    
    if (error) {
        return <Box sx={{ p: 3, textAlign: 'center' }}><Typography color="error">Error: {error}</Typography></Box>;
    }
    
    if (!data) {
        return <Box sx={{ p: 3, textAlign: 'center' }}><Typography>No se encontraron datos.</Typography></Box>;
    }

    // Procesar valores para convertirlos en lista
    const valoresList = data.valores.split('\n').filter(item => item.trim() !== '');

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                background: 'linear-gradient(to bottom, #f5f5f5,)',
            }}
        >
            <Fade in={animated} timeout={1000}>
                <Paper
                    elevation={4}
                    sx={{
                        padding: { xs: '20px', sm: '30px' },
                        backgroundColor: '#FFFFFF',
                        maxWidth: '900px',
                        width: '100%',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.4s ease-in-out',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                            transform: { xs: 'none', sm: 'scale(1.02)' }, // Efecto hover solo en pantallas grandes
                            boxShadow: { xs: '0 10px 30px rgba(0, 0, 0, 0.1)', sm: '0 15px 40px rgba(0, 0, 0, 0.2)' },
                        }
                    }}
                >
                    {/* Título dinámico */}
                    <Typography
                        variant="h3"
                        sx={{
                            color: colors.primaryText,
                            fontWeight: 'bold',
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            mb: 3,
                            textAlign: 'center',
                            position: 'relative',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: '60px',
                                height: '3px',
                                background: colors.highlightText,
                                bottom: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                            },
                            '&:hover': {
                                color: colors.highlightText,
                            }
                        }}
                    >
                        {data.nombre}
                    </Typography>

                    {/* Descripción */}
                    <Fade in={animated} timeout={1500}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: colors.primaryText,
                                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                textAlign: 'center',
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                lineHeight: 1.6,
                                maxWidth: '800px',
                                padding: '0 16px',
                                '&:hover': {
                                  
                                }
                            }}
                        >
                            {data.descripcion}
                        </Typography>
                    </Fade>

                    {/* Misión y Visión */}
                    <Grid container spacing={4} sx={{ mt: 4, justifyContent: 'center' }}>
                        {[
                            { title: 'Misión', text: data.mision, icon: <MissionIcon sx={{ fontSize: 40, color: colors.iconColor }} />, background: colors.misionCard },
                            { title: 'Visión', text: data.vision, icon: <VisionIcon sx={{ fontSize: 40, color: colors.iconColor }} />, background: colors.visionCard },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Zoom in={animated}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            padding: '25px',
                                            borderRadius: '12px',
                                            background: item.background,
                                            textAlign: 'center',
                                            maxWidth: '350px',
                                            width: '100%',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: { xs: 'none', sm: 'scale(1.05)' }, // Efecto hover solo en pantallas grandes
                                                boxShadow: { xs: '0 5px 15px rgba(0, 0, 0, 0.1)', sm: '0 10px 20px rgba(0, 0, 0, 0.2)' },
                                            }
                                        }}
                                    >
                                        <Box sx={{ textAlign: 'center', mb: 2 }}>{item.icon}</Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primaryText, mb: 2 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: colors.primaryText }}>
                                            {item.text}
                                        </Typography>
                                    </Paper>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Valores */}
                    <Zoom in={animated}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: '25px',
                                borderRadius: '12px',
                                background: colors.valuesCard,
                                textAlign: 'center',
                                maxWidth: '600px',
                                width: '100%',
                                mt: 4,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: { xs: 'none', sm: 'scale(1.02)' }, // Efecto hover solo en pantallas grandes
                                    boxShadow: { xs: '0 5px 15px rgba(0, 0, 0, 0.1)', sm: '0 10px 20px rgba(0, 0, 0, 0.2)' },
                                }
                            }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <ValuesIcon sx={{ fontSize: 30, color: colors.iconColor }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primaryText }}>
                                    Valores
                                </Typography>
                            </Box>

                            <List>
                                {valoresList.map((valor, index) => (
                                    <Fade 
                                        key={index}
                                        in={animated} 
                                        style={{ 
                                            transitionDelay: `${1200 + (index * 150)}ms` 
                                        }}
                                    >
                                        <ListItem 
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: { xs: 'none', sm: 'translateX(8px)' }, // Efecto hover solo en pantallas grandes
                                                    '& .MuiListItemIcon-root': {
                                                        transform: { xs: 'none', sm: 'scale(1.2)' },
                                                    }
                                                }
                                            }}
                                        >
                                            <ListItemIcon 
                                                sx={{ 
                                                    minWidth: '40px',
                                                    transition: 'transform 0.3s ease' 
                                                }}
                                            >
                                                <CheckCircleIcon sx={{ color: colors.highlightText }} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            '& span': {
                                                                display: 'inline',
                                                                transition: 'color 0.3s ease',
                                                                '&:hover': {
                                                                   
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {valor}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    </Fade>
                                ))}
                            </List>
                        </Paper>
                    </Zoom>
                </Paper>
            </Fade>
        </Box>
    );
};

export default AcercaDe;
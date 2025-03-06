import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    IconButton,
    TextField,
    Typography,
    Tooltip,
    Zoom
} from '@mui/material';
import {
    Close as CloseIcon,
    Send as SendIcon,
    SwapHoriz as SwapHorizIcon,
    Lightbulb as LightbulbIcon,
    Chat as ChatIcon
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Definimos las animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;
const INSTRUCCIONES = [
  "¡Bienvenido a GisLive Boutique Clínica! 🩺",
  "Estoy aquí para ayudarte con:",
  "• Realizar compras de uniformes clínicos",
  "• Consultar disponibilidad de productos",
  "• Resolver dudas sobre tallas y modelos",
  "• Proporcionar recomendaciones personalizadas",
  "• Gestionar tu cuenta y pedidos"
];

const TOOLTIP_MESSAGES = [
  "¿Necesitas ayuda con tu compra? ¡Estoy aquí para ayudarte! 💬",
  "¡Hola! Soy tu asistente virtual de GisLive 👋",
  "¿Buscas un producto específico? ¡Pregunta y te ayudo! 🩺",
  "Consulta tu pedido o busca más opciones de uniformes",
  "¿Tienes alguna duda sobre nuestros productos? ¡Pregunta!"
];

const FAQ_QUESTIONS = [
  "¿Cuánto cuesta un uniforme clínico?",
  "¿Cuáles son las opciones de pago disponibles?",
  "¿Cómo puedo elegir la talla adecuada?",
  "¿Los uniformes tienen garantía?",
  "¿Puedo comprar en línea y recoger en tienda?"
];


const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState('right');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [showQuickQuestions, setShowQuickQuestions] = useState(false);
    const messagesEndRef = useRef(null);
    const tooltipTimeoutRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);


    useEffect(() => {
        const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkTheme(matchDarkTheme.matches);

        const handleThemeChange = (e) => setIsDarkTheme(e.matches);
        matchDarkTheme.addEventListener('change', handleThemeChange);
        return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
    }, []);

    useEffect(() => {
        if (showTooltip && !isOpen) {
            const intervalId = setInterval(() => {
                setCurrentTooltipIndex(prev =>
                    prev === TOOLTIP_MESSAGES.length - 1 ? 0 : prev + 1
                );
            }, 9000); // Cambia cada 3 segundos

            return () => clearInterval(intervalId);
        }
    }, [showTooltip, isOpen]);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                text: INSTRUCCIONES.join('\n'),
                isUser: false
            }]);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleMouseEnter = () => {
        tooltipTimeoutRef.current = setTimeout(() => {
            setShowTooltip(true);
        }, 5000);
    };

    const handleMouseLeave = () => {
        clearTimeout(tooltipTimeoutRef.current);
        setShowTooltip(false);
    };

    const togglePosition = () => {
        setPosition(prev => prev === 'right' ? 'left' : 'right');
    };

    const handleSendMessage = (e) => {
        e?.preventDefault();
        if (!message.trim()) return;

        setMessages(prev => [...prev, { text: message, isUser: true }]);
        setMessage('');

        setTimeout(() => {
            setMessages(prev => [...prev, {
                text: "Gracias ¿En qué puedo ayudarte amig@?",
                isUser: false
            }]);
        }, 1000);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 300); // Duración de la animación
    };

    const styles = {
      container: {
        position: 'fixed',
        bottom: '32px',
        [position]: '88px',
        zIndex: 999,
        animation: `${fadeIn} 0.3s ease-out`,
        '&.closing': {
          animation: `${fadeOut} 0.3s ease-out`
        }
      },
      chatWindow: {
        width: '350px',
        height: '500px',
        display: 'flex',
        m: '5px',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '4px 4px 10px rgba(100, 100, 100, 0.2)',
        background: isDarkTheme
          ? 'linear-gradient(135deg, #2D2D2D 0%, #1F1F1F 100%)'
          : 'linear-gradient(90deg, #ffffff 0%, #f0f0f0 100%)',
        border: `1px solid ${isDarkTheme ? '#2A2A2A' : '#B0B0B0'}`
      },
      header: {
        p: 2,
        background: isDarkTheme
          ? 'linear-gradient(135deg, #3A3A3A 0%, #2D2D2D 100%)'
          : 'linear-gradient(90deg, #2D8CBB 0%, #4D9DBB 100%)',
        color: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      },
      messageArea: {
        flexGrow: 1,
        overflowY: 'auto',
        p: 2,
        bgcolor: isDarkTheme ? '#3A3A3A' : '#F4F4F4'
      },
      message: (isUser) => ({
        maxWidth: '80%',
        p: '12px 16px',
        borderRadius: isUser ? '12px 12px 0 12px' : '12px 12px 12px 0',
        bgcolor: isUser
          ? isDarkTheme ? '#4D8C9E' : '#2D8CBB'
          : isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : '#D9F0F6',
        color: isUser
          ? '#ffffff'
          : isDarkTheme ? 'rgba(255, 255, 255, 0.9)' : '#2D2D2D'
      }),
      inputArea: {
        p: 2,
        bgcolor: isDarkTheme ? '#2D2D2D' : '#F4F4F4',
        display: 'flex',
        gap: 1,
        borderTop: `1px solid ${isDarkTheme ? 'rgba(80, 80, 80, 0.8)' : 'rgba(0, 0, 0, 0.1)'}`
      },
      textField: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 4,
          bgcolor: isDarkTheme ? '#333333' : '#ffffff',
          color: isDarkTheme ? '#ffffff' : '#2D8CBB',
          '& fieldset': {
            borderColor: isDarkTheme ? '#444444' : '#B0B0B0',
          },
          '&:hover fieldset': {
            borderColor: isDarkTheme ? '#555555' : '#2D8CBB',
          }
        },
        '& input::placeholder': {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(45, 140, 187, 0.5)',
        }
      },
      quickQuestions: {
        position: 'absolute',
        top: '40px',
        right: 0,
        bgcolor: isDarkTheme ? '#2D2D2D' : '#F4F4F4',
        borderRadius: '10px',
        p: 1,
        width: '250px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: `1px solid ${isDarkTheme ? '#444444' : '#2D8CBB'}`
      },
      chatButton: {
        position: 'fixed',
        bottom: '32px',
        [position]: '32px',
        zIndex: 1000,
        width: '56px',
        height: '56px',
        background: isDarkTheme
          ? 'linear-gradient(135deg, #2D8CBB 0%, #4D9DBB 100%)'
          : 'linear-gradient(45deg, #2D8CBB 0%, #4D9DBB 50%, #0288d1 100%)',
        color: '#ffffff',
        boxShadow: '4px 4px 10px rgba(45, 140, 187, 0.3)',
        borderRadius: '28px',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: isDarkTheme
            ? 'linear-gradient(135deg, #4D9DBB 0%, #2D8CBB 100%)'
            : 'linear-gradient(45deg, #0288d1 0%, #4D9DBB 50%, #2D8CBB 100%)',
          transform: 'scale(1.05)',
          boxShadow: '0 6px 15px rgba(45, 140, 187, 0.4)',
          '& .chatIcon': {
            animation: `${pulse} 1s infinite`
          }
        },
        '& .chatIcon': {
          fontSize: '28px',
          transition: 'all 0.3s ease'
        }
      },
      tooltipBox: {
        position: 'absolute',
        [position === 'right' ? 'right' : 'left']: '70px',
        bottom: '8px',
        backgroundColor: isDarkTheme ? '#2D2D2D' : '#F4F4F4',
        color: isDarkTheme ? '#ffffff' : '#2D8CBB',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap',
        animation: `${fadeIn} 0.3s ease-out`,
        zIndex: 1001,
        border: `1px solid ${isDarkTheme ? '#444444' : '#2D8CBB'}`,
        '&::after': {
          content: '""',
          position: 'absolute',
          [position === 'right' ? 'right' : 'left']: '-6px',
          bottom: '50%',
          transform: 'translateY(50%)',
          width: '0',
          height: '0',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          [position === 'right' ? 'borderLeft' : 'borderRight']: `6px solid ${isDarkTheme ? '#2D2D2D' : '#F4F4F4'}`
        }
      }
    };
    

    return (
        <>
            {isOpen && (
                <Box sx={styles.container} className={isClosing ? 'closing' : ''}>
                    <Box sx={styles.chatWindow}>
                        <Box sx={styles.header}>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                Chat en vivo
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                    size="small"
                                    onClick={() => setShowQuickQuestions(prev => !prev)}
                                    sx={{ color: 'inherit', mr: 1 }}
                                >
                                    <LightbulbIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={togglePosition}
                                    sx={{ color: 'inherit', mr: 1 }}
                                >
                                    <SwapHorizIcon />
                                </IconButton>
                            </Box>

                            {showQuickQuestions && (
                                <Box sx={styles.quickQuestions}>
                                    {FAQ_QUESTIONS.map((question, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => {
                                                setMessage(question);
                                                setShowQuickQuestions(false);
                                            }}
                                            sx={{
                                                p: 1,
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                mb: 0.5,
                                                color: isDarkTheme ? '#ffffff' : '#03427C',
                                                '&:hover': {
                                                    bgcolor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(3,66,124,0.1)',
                                                }
                                            }}
                                        >
                                            {question}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>

                        <Box sx={styles.messageArea}>
                            {messages.map((msg, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                                        mb: 1,
                                    }}
                                >
                                    <Box sx={styles.message(msg.isUser)}>
                                        <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                                            {msg.text}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>

                        <Box
                            component="form"
                            onSubmit={handleSendMessage}
                            sx={styles.inputArea}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe tu mensaje..."
                                variant="outlined"
                                sx={styles.textField}
                            />
                            <IconButton
                                type="submit"
                                disabled={!message.trim()}
                                sx={{
                                    color: isDarkTheme ? '#ffffff' : '#03427C',
                                    '&:hover': {
                                        bgcolor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(3, 66, 124, 0.1)',
                                    }
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            )}

            <Box
                sx={styles.chatButton}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {showTooltip && !isOpen && (
                    <Box
                        sx={{
                            ...styles.tooltipBox,
                            animation: `${fadeIn} 0.3s ease-out`,
                        }}
                        key={currentTooltipIndex}
                    >
                        {TOOLTIP_MESSAGES[currentTooltipIndex]}
                    </Box>
                )}
                <IconButton
                    onClick={isOpen ? handleClose : () => setIsOpen(true)}
                    sx={{
                        width: '100%',
                        height: '100%',
                        color: '#ffffff',
                        '&:hover': {
                            bgcolor: 'transparent'
                        }
                    }}
                >
                    {isOpen ? (
                        <CloseIcon />
                    ) : (
                        <ChatIcon className="chatIcon" />
                    )}
                </IconButton>
            </Box>
        </>
    );
};

export default Chat;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const MySwal = withReactContent(Swal);

function SolicitarCodigo() {
    const [gmail, setGmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar el correo al backend para solicitar el código de recuperación
            await axios.post("https://backendgislive.onrender.com/api/codigo/forgot-password", { gmail });
            
            // Mostrar alerta de éxito
            MySwal.fire({
                title: "Código enviado",
                text: "Por favor revisa tu correo electrónico para obtener el código de recuperación.",
                icon: "success",
            });

            // Navegar a la página de validación del código
            navigate('/validar_codigo', { state: { email: gmail } });
        } catch (error) {
            // Mostrar error si no se pudo enviar el correo
            MySwal.fire({
                title: "Error",
                text: "No se pudo enviar el correo de recuperación.",
                icon: "error",
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, marginTop: 6 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                    Recuperar Contraseña
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Introduce tu correo electrónico"
                        type="email"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        required
                        margin="normal"
                        InputProps={{
                            style: { borderRadius: 8 },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                            marginTop: 2,
                            borderRadius: 2,
                            textTransform: 'none',
                        }}
                    >
                        Solicitar Código
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default SolicitarCodigo;

import React, { useState } from 'react';
import { Box, Typography, Tab, Tabs, Card, CardContent, IconButton, CircularProgress } from '@mui/material';
import { FaFileAlt, FaExclamationTriangle, FaFileContract, FaBuilding } from 'react-icons/fa'; // Íconos
import Politicas from './Administrativo/Politicas';
import Deslinde from './Administrativo/Deslinde';
import Terminos from './Administrativo/Terminos';
import { Link } from 'react-router-dom';

const Configuracion = () => {
  const [selectedTab, setSelectedTab] = useState(-1); // Estado inicial -1 para mostrar el mensaje de selección
  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga

  // Manejar el cambio de pestaña y mostrar "Cargando" por 2 segundos
  const handleTabChange = (event, newValue) => {
    setLoading(true); // Activar estado de carga
    setSelectedTab(newValue);

    // Simular carga de 2 segundos antes de mostrar el contenido
    setTimeout(() => {
      setLoading(false); // Desactivar estado de carga después de 2 segundos
    }, 2000);
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8f5e9 30%, #f3f4f6 100%)', // Color de fondo
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Título principal */}
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: '#388e3c', // Nuevo color de texto
          fontFamily: 'Roboto, sans-serif',
          textAlign: 'center',
        }}
      >
        Configuración de la Empresa
      </Typography>

      {/* Pestañas con íconos */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="secondary" // Color del indicador de la pestaña
        textColor="secondary" // Color del texto de la pestaña
        centered
        sx={{
          mb: 4,
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#dcedc8', // Color al pasar el ratón
            },
            transition: '0.3s',
          },
          '& .Mui-selected': {
            color: '#388e3c !important', // Nuevo color cuando la pestaña está seleccionada
          },
        }}
      >
        <Tab
          label="Aviso de Privacidad"
          icon={<FaFileAlt />}
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        />
        <Tab
          label="Deslinde Legal"
          icon={<FaExclamationTriangle />}
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        />
        <Tab
          label="Términos y Condiciones"
          icon={<FaFileContract />}
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        />
      </Tabs>

      {/* Renderizado condicional según la pestaña seleccionada */}
      <Card
        sx={{
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          transition: 'all 0.5s ease',
        }}
      >
        <CardContent>
          {loading ? (
            // Mostrar el indicador de carga cuando loading es true
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Cargando...
              </Typography>
            </Box>
          ) : (
            <>
              {selectedTab === -1 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="textSecondary">
                    Selecciona una opción para ver su contenido
                  </Typography>
                </Box>
              ) : (
                <>
                  {selectedTab === 0 && <Politicas />}
                  {selectedTab === 1 && <Deslinde />}
                  {selectedTab === 2 && <Terminos />}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Contenedor del botón flotante y texto */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Botón flotante para ir al perfil de la empresa */}
        <IconButton
          component={Link}
          to="/Administrativo/PerfilEmpresa"
          sx={{
            backgroundColor: '#388e3c', // Nuevo color de fondo
            color: '#fff',
            '&:hover': {
              backgroundColor: '#2e7d32', // Nuevo color al pasar el ratón
            },
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            p: 2,
            borderRadius: '50%',
          }}
        >
          <FaBuilding size={24} />
        </IconButton>

        {/* Texto debajo del botón */}
        <Typography
          variant="caption"
          sx={{
            color: '#388e3c', // Color del texto
            fontSize: '12px',
            mt: 1, // Margen superior para separar el texto del botón
            textAlign: 'center',
          }}
        >
          Perfil de Empresa
        </Typography>
      </Box>
    </Box>
  );
};

export default Configuracion;

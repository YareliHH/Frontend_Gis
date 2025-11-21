// Componente para mostrar prompt de instalación de PWA
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Paper, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Escuchar evento beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      
      // Mostrar el prompt después de 10 segundos (no intrusivo)
      setTimeout(() => {
        // Solo mostrar si no se ha instalado antes
        const hasInstalledBefore = localStorage.getItem('pwa-installed');
        const hasDismissed = localStorage.getItem('pwa-dismissed');
        
        if (!hasInstalledBefore && !hasDismissed) {
          setShowPrompt(true);
        }
      }, 10000);
    };

    // Detectar si la app ya está instalada
    const handleAppInstalled = () => {
      console.log('✅ PWA instalada exitosamente');
      localStorage.setItem('pwa-installed', 'true');
      setShowPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Manejar instalación
  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ Usuario aceptó instalar la PWA');
        localStorage.setItem('pwa-installed', 'true');
      } else {
        console.log('❌ Usuario rechazó instalar la PWA');
      }
      
      setShowPrompt(false);
      setInstallPrompt(null);
    } catch (error) {
      console.error('Error al instalar PWA:', error);
    }
  };

  // Cerrar el prompt
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
    
    // Volver a mostrar en 7 días
    setTimeout(() => {
      localStorage.removeItem('pwa-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <Slide direction="up" in={showPrompt} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 400,
          width: 'calc(100% - 40px)',
          p: 2.5,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #3B8D99 0%, #2A7F62 100%)',
          color: 'white',
          zIndex: 9999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
      >
        {/* Botón cerrar */}
        <IconButton
          onClick={handleDismiss}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Contenido */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <PhoneAndroidIcon sx={{ fontSize: 40, mt: 0.5 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Instala GisLive Boutique
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95, lineHeight: 1.5 }}>
              Accede más rápido a tus uniformes favoritos. Instala nuestra app y disfruta de:
            </Typography>
            <Box component="ul" sx={{ mt: 1, pl: 2, fontSize: '14px' }}>
              <li>Acceso rápido desde tu pantalla principal</li>
              <li>Funciona sin conexión</li>
              <li>Notificaciones de ofertas exclusivas</li>
            </Box>
          </Box>
        </Box>

        {/* Botones */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<GetAppIcon />}
            onClick={handleInstall}
            sx={{
              backgroundColor: 'white',
              color: '#3B8D99',
              fontWeight: 700,
              py: 1.2,
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.2s'
            }}
          >
            Instalar Ahora
          </Button>
          <Button
            variant="text"
            onClick={handleDismiss}
            sx={{
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Ahora no
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
};

export default InstallPWA;
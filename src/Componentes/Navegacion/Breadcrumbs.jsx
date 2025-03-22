import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Home, NavigateNext } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Breadcrumbs = ({ paths }) => {
  const theme = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Intentar obtener preferencia de modo oscuro del localStorage primero
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkTheme(savedMode === 'true');
    } else {
      // Si no hay preferencia guardada, detectar del sistema
      const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkTheme(matchDarkTheme.matches);
      const handleThemeChange = (e) => setIsDarkTheme(e.matches);
      matchDarkTheme.addEventListener('change', handleThemeChange);
      return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
    }
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        padding: '10px 16px',
        margin: '0 0 16px 0',
        borderRadius: '8px',
        animation: `${fadeIn} 0.5s ease-out`,
        backgroundColor: isDarkTheme ? 'rgba(30, 30, 45, 0.6)' : 'rgba(240, 248, 255, 0.8)',
      }}
    >
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: isDarkTheme ? '#90caf9' : '#4285f4', opacity: 0.7 }} />}
        aria-label="breadcrumb"
      >
        <Link to="/cliente" style={{ textDecoration: 'none', color: isDarkTheme ? '#90caf9' : '#4285f4' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            '&:hover': { 
              textDecoration: 'underline' 
            }
          }}>
            <Home sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Inicio</Typography>
          </Box>
        </Link>

        {paths.map((path, index) => {
          if (path.name === "Inicio" || path.name === "Home") return null;
          const isLast = index === paths.length - 1;

          return (
            <Box key={path.path || index}>
              {isLast ? (
                <Typography 
                  sx={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    color: isDarkTheme ? '#ffffff' : '#333333'
                  }}
                >
                  {path.name}
                </Typography>
              ) : (
                <Link 
                  to={path.path} 
                  style={{ 
                    textDecoration: 'none', 
                    color: isDarkTheme ? '#90caf9' : '#4285f4' 
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 500,
                      '&:hover': { 
                        textDecoration: 'underline' 
                      }
                    }}
                  >
                    {path.name}
                  </Typography>
                </Link>
              )}
            </Box>
          );
        })}
      </MuiBreadcrumbs>
    </Paper>
  );
};

export default Breadcrumbs;
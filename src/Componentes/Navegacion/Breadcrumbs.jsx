import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Home } from '@mui/icons-material';
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
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkTheme(matchDarkTheme.matches);
    const handleThemeChange = (e) => setIsDarkTheme(e.matches);
    matchDarkTheme.addEventListener('change', handleThemeChange);
    return () => matchDarkTheme.removeEventListener('change', handleThemeChange);
  }, []);

  return (
    <Box
      sx={{
        padding: '8px 16px',
        borderRadius: '8px',
        animation: `${fadeIn} 0.5s ease-out`,
      }}
    >
      <MuiBreadcrumbs
        separator={<Typography sx={{ mx: 0.5 }}> / </Typography>}
        aria-label="breadcrumb"
      >
        <Link to="/" style={{ textDecoration: 'underline', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.3, fontSize: '0.9rem' }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>Inicio</Typography>
          </Box>
        </Link>

        {paths.map((path, index) => {
          if (path.name === "Inicio") return null;
          const isLast = index === paths.length - 1;

          return (
            <Box key={path.path || index}>
              {isLast ? (
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {path.name}
                </Typography>
              ) : (
                <Link to={path.path} style={{ textDecoration: 'underline', color: 'inherit' }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {path.name}
                  </Typography>
                </Link>
              )}
            </Box>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
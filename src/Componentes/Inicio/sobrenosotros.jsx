import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SobreNosotros = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
          Sobre Nosotros
        </Typography>
        <Typography variant="body1" paragraph>
          En <strong>GisLive Boutique Clínica</strong>, nos dedicamos a proporcionar uniformes clínicos de alta calidad, diseñados para profesionales
          de la salud que buscan comodidad, estilo y durabilidad. Nuestra pasión por la moda y la funcionalidad nos ha llevado a crear una línea de 
          productos que no solo cumplen con los estándares de la industria médica, sino que también permiten a los profesionales expresarse a través de sus atuendos.
        </Typography>
        <Typography variant="body1" paragraph>
          Con una sólida base en el compromiso y el servicio al cliente, trabajamos cada día para asegurar que nuestros clientes reciban la mejor atención 
          y productos adaptados a sus necesidades.
        </Typography>
      </Box>

      <Box sx={{ padding: 4, backgroundColor: '#e3f2fd', borderRadius: 2, boxShadow: 3, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
          Visión
        </Typography>
        <Typography variant="body1" paragraph>
          Ser la empresa líder en el mercado de uniformes clínicos, reconocida por nuestra innovación en diseños, calidad superior y un enfoque personalizado
          hacia nuestros clientes, contribuyendo al bienestar y la imagen de los profesionales de la salud en todo el país.
        </Typography>
      </Box>

      <Box sx={{ padding: 4, backgroundColor: '#f1f8e9', borderRadius: 2, boxShadow: 3, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1565c0', fontWeight: 'bold' }}>
          Misión
        </Typography>
        <Typography variant="body1" paragraph>
          En <strong>GisLive Boutique Clínica</strong>, nuestra misión es proporcionar a los profesionales de la salud uniformes que combinen funcionalidad
          y estilo, garantizando su comodidad durante largas jornadas de trabajo. Nos comprometemos a ofrecer productos de calidad excepcional y un servicio
          al cliente enfocado en las necesidades específicas de nuestros usuarios, ayudando a proyectar una imagen profesional y confiable.
        </Typography>
      </Box>

      {/* Botón de "Atrás" */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBackClick} 
          sx={{ backgroundColor: '#1565c0', color: '#fff' }}>
          Atrás
        </Button>
      </Box>
    </Container>
  );
};

export default SobreNosotros;

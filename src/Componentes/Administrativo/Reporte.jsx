import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';

const Actividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch('https://backend-gis-1.onrender.com/api/reportes/actividades', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.message || 'Error al obtener las actividades');
        }

        const data = await response.json();
        setActividades(data); // Guardar los datos recibidos
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    };

    fetchActividades();
  }, []);

  return (
    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
          <CircularProgress size={30} />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: 'center', fontSize: '0.9rem' }}>{error}</Typography>
      ) : (
        <>
          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2', fontSize: '1rem', mb: 1 }}>
            Actividades Registradas
          </Typography>
          <TableContainer component={Paper} sx={{ maxWidth: '800px', width: '90%', borderRadius: 2, boxShadow: 2, padding: 1 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center', color: '#fff', padding: '6px' }}>
                    Usuario
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center', color: '#fff', padding: '6px' }}>
                    Actividad
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center', color: '#fff', padding: '6px' }}>
                    Fecha
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actividades.length > 0 ? (
                  actividades.map((actividad) => (
                    <TableRow key={actividad.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center', padding: '4px' }}>
                        {actividad.usuario}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center', padding: '4px' }}>
                        {actividad.actividad}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', textAlign: 'center', padding: '4px' }}>
                        {format(new Date(actividad.fecha), 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', fontSize: '0.8rem', padding: '8px', color: '#666' }}>
                      No hay actividades registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
);
};

export default Actividades;

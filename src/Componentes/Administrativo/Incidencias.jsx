import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RegistroActividades() {
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    // Obtener las actividades del backend
    const obtenerActividades = async () => {
      try {
        const response = await axios.get('https://backendgislive.onrender.com/api/registro-actividades');
        setActividades(response.data);
      } catch (error) {
        console.error('Error al obtener actividades:', error);
      }
    };

    obtenerActividades();
  }, []);

  return (
    <div className="container">
      <h2>Incidencias</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID de Usuario</th>
            <th>Actividad</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((actividad, index) => (
            <tr key={index}>
              <td>{actividad.usuarios_id}</td>
              <td>{actividad.actividad}</td>
              <td>{new Date(actividad.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegistroActividades;

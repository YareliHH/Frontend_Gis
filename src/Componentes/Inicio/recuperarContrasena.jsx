import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom'; // Para obtener el token de la URL

const PasswordManager = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token'); // Obtener el token de la URL

  // Manejar el envío del formulario para recuperar la contraseña
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/recuperar-password', { email });
      setMensaje('Se ha enviado un correo para recuperar tu contraseña.');
    } catch (error) {
      setMensaje('Hubo un error al enviar el correo de recuperación.');
    }
  };

  // Manejar el envío del formulario para restablecer la contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post('/reset-password', { token, newPassword });
      setMensaje('Contraseña restablecida correctamente.');
    } catch (error) {
      setMensaje('Hubo un error al restablecer la contraseña.');
    }
  };

  // Si hay token en la URL, se muestra el formulario para restablecer la contraseña
  return (
    <div>
      {!token ? (
        <div>
          <h2>Recuperar Contraseña</h2>
          <form onSubmit={handleEmailSubmit}>
            <label>
              Ingresa tu correo electrónico:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit">Enviar</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Restablecer Contraseña</h2>
          <form onSubmit={handlePasswordSubmit}>
            <label>
              Nueva contraseña:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirmar contraseña:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit">Restablecer Contraseña</button>
          </form>
        </div>
      )}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default PasswordManager;

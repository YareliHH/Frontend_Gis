import React from 'react';
import { Avatar, Typography, Button, Box } from '@mui/material';

const UserProfile = ({ user }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      p={3} 
      border={1} 
      borderRadius={2} 
      borderColor="grey.300" 
      width={300} 
      bgcolor="background.paper"
    >
      {/* Foto de perfil */}
      <Avatar 
        alt={user.name} 
        src={user.profilePicture || 'https://via.placeholder.com/150'} 
        sx={{ width: 150, height: 150 }}
      />

      {/* Información del usuario */}
      <Box mt={2} textAlign="center">
        <Typography variant="h5">{user.name}</Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>Joined:</strong> {new Date(user.joinedDate).toLocaleDateString()}
        </Typography>
      </Box>

      {/* Acciones */}
      <Box mt={3} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={user.onEditProfile}>
          Editar perfil
        </Button>
        <Button variant="outlined" color="secondary" onClick={user.onLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

// Ejemplo de datos de usuario
const userData = {
  name: 'Yareli Hdez Hdez',
  email: '20221124@gmail.com',
  profilePicture: null, // Si no hay imagen de perfil, se mostrará un placeholder
  joinedDate: '2023-04-15', // Fecha de registro del usuario
  onEditProfile: () => alert('Edit Profile clicked!'),
  onLogout: () => alert('Logout clicked!'),
};

// Ejemplo de uso del componente UserProfile
const App = () => {
  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <UserProfile user={userData} />
    </Box>
  );
};

export default App;

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  IconButton, 
  Tabs, 
  Tab
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Person, 
  Email, 
  Phone, 
  CameraAlt, 
  ShoppingCart, 
  DateRange 
} from '@mui/icons-material';

const UserProfile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [tempUser, setTempUser] = useState(user);
  const [purchases, setPurchases] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Add validation logic here
    setUser(tempUser);
    setEditMode(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        {/* Profile Header */}
        <Box 
          sx={{ 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText', 
            py: 4, 
            textAlign: 'center' 
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={user.avatar || '/default-avatar.png'}
              sx={{ 
                width: 150, 
                height: 150, 
                border: '4px solid white', 
                boxShadow: 3 
              }}
            />
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <input 
                type="file" 
                hidden 
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <CameraAlt />
            </IconButton>
          </Box>
          
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
            {user.firstName || 'Nombre'} {user.lastName || 'Apellido'}
          </Typography>
          <Typography variant="subtitle1">
            {user.email || 'correo@ejemplo.com'}
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Perfil" icon={<Person />} />
          <Tab label="Historial" icon={<ShoppingCart />} />
        </Tabs>

        {/* Profile Content */}
        {tabValue === 0 && (
          <Box sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="firstName"
                  value={editMode ? tempUser.firstName : user.firstName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  name="lastName"
                  value={editMode ? tempUser.lastName : user.lastName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  value={editMode ? tempUser.email : user.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={editMode ? tempUser.phone : user.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: 'right' }}>
              {!editMode ? (
                <Button 
                  variant="contained" 
                  startIcon={<Edit />}
                  onClick={() => setEditMode(true)}
                >
                  Editar Perfil
                </Button>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setEditMode(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<Save />}
                    onClick={handleSave}
                    color="primary"
                  >
                    Guardar Cambios
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Purchase History */}
        {tabValue === 1 && (
          <Box sx={{ p: 4 }}>
            {purchases.length > 0 ? (
              purchases.map((purchase) => (
                <Paper 
                  key={purchase.id} 
                  elevation={1} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2, 
                    mb: 2,
                    borderRadius: 2
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      {purchase.product}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateRange fontSize="small" />
                      <Typography variant="body2">
                        {purchase.date}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" color="primary">
                      {purchase.price}
                    </Typography>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography variant="body1" align="center" color="textSecondary">
                No hay historial de compras
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;
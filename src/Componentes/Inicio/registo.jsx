import React, { useState } from 'react';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Registro = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordSafe, setIsPasswordSafe] = useState(false);
  const [isPasswordFiltered, setIsPasswordFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const noRepeatingChars = !/(.)\1{2}/.test(password); // No repetir más de 3 letras seguidas

    if (!hasUpperCase) errors.push('Debe tener al menos una letra mayúscula.');
    if (!hasNumber) errors.push('Debe tener al menos un número.');
    if (!hasSpecialChar) errors.push('Debe tener al menos un símbolo especial.');
    if (!hasMinLength) errors.push('Debe tener al menos 8 caracteres.');
    if (!noRepeatingChars) errors.push('No puede tener más de 3 letras seguidas iguales.');

    return errors.length === 0;
  };

  const evaluatePasswordStrength = (password) => {
    let strength = 'Débil';
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password) && password.length >= 8) {
      strength = 'Fuerte';
    } else if (/[A-Z]/.test(password) || /\d/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength = 'Media';
    }
    setPasswordStrength(strength);
  };

  const checkPasswordSafety = async (password) => {
    setIsLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);

      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const hashes = response.data.split('\n').map(line => line.split(':')[0]);

      if (hashes.includes(suffix.toUpperCase())) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
        setIsPasswordSafe(false);
        setIsPasswordFiltered(true);
      } else {
        setPasswordError('');
        setIsPasswordSafe(true);
        setIsPasswordFiltered(false);
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      setPasswordError('Error al verificar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim(),
    });

    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('La contraseña no cumple con los requisitos.');
      } else {
        setPasswordError('');
        evaluatePasswordStrength(value);
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setPasswordMatchError('Las contraseñas no coinciden.');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setPasswordError('La contraseña no cumple con los requisitos.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError('Las contraseñas no coinciden.');
      return;
    }

    const hashedPassword = CryptoJS.SHA256(formData.password).toString();

    const registroData = {
      ...formData,
      password: hashedPassword,
    };

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/registro', registroData);
      console.log(response.data);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        name="password"
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(passwordError)}
        helperText={passwordError || `Fortaleza: ${passwordStrength}`}
      />

      <TextField
        label="Confirmar Contraseña"
        type={showConfirmPassword ? 'text' : 'password'}
        name="confirmPassword"
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={Boolean(passwordMatchError)}
        helperText={passwordMatchError}
      />

      <Button type="submit" disabled={isLoading}>Registrar</Button>
    </form>
  );
};

export default Registro;

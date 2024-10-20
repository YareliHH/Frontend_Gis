import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Box, InputAdornment } from '@mui/material';
import { Person, Email, Phone, Lock, AccountBox } from '@mui/icons-material';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Registro = () => {
  const[activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');


    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;// validar nombres (letras, incluyendo caracteres acentuados y espacios)
    const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/; //validar correos electrónicos (solo Gmail, Hotmail y Outlook)
    const phoneRegex = /^[0-9]{10}$/;//para validar teléfonos (10 dígitos numéricos)

    

// Función para verificar si la contraseña cumple con las reglas personalizadas
  const checkPasswordRules = (password) => {
    const errors = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const noRepeatingChars = !/(.)\1{2}/.test(password); // No repetir más de 3 letras seguidas

    if (!hasUpperCase) errors.push('Debe tener al menos una letra mayúscula.');
    if (!hasNumber) errors.push('Debe tener al menos un número.');
    if (!hasSpecialChar) errors.push('Debe tener al menos un símbolo especial.');
    if (!hasMinLength) errors.push('Debe tener más de 8 caracteres.');
    if (!noRepeatingChars) errors.push('No puede tener más de 3 letras seguidas iguales.');

    return errors;
  };
  // Función para verificar si la contraseña ha sido filtrada en brechas de seguridad
  const checkPasswordSafety = async (password) => {
    setIsLoading(true); // Iniciar la carga
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);
      

      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const hashes = response.data.split('\n').map(line => line.split(':')[0]);

      if (hashes.includes(suffix.toUpperCase())) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
        setIsPasswordSafe(false);
        setIsPasswordFiltered(true); // Actualizar el estado de filtrado
      } else {
        setPasswordError('');
        setIsPasswordSafe(true);
        setIsPasswordFiltered(false); // Contraseña no filtrada
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      setPasswordError('Error al verificar la contraseña.');
    } finally {
      setIsLoading(false); // Detener la carga
    }
  };

  /////////////////
  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData({
      ...formData,
      [name]: trimmedValue,
    });
  
    // Validación para la contraseña
    if (name === 'password') {
      if (!validatePassword(trimmedValue)) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      } else {
        setPasswordError('');
        evaluatePasswordStrength(trimmedValue);
      }
    }
  
    // Validación para confirmar contraseña
    if (name === 'confirmPassword') {
      if (trimmedValue !== formData.password) {
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

    try {
      const correoResponse = await axios.post('https://backendgislive.onrender.com/api/verificar-correo', { correo: formData.correo });
      if (correoResponse.data.exists) {
        setMensaje('El correo ya está registrado. Intenta con otro.');
        return;
      }
    } catch (error) {
      setMensaje('Error al verificar el correo.');
      return;
    }

    // Encriptación usando CryptoJS
    const hashedPassword = CryptoJS.SHA256(formData.password).toString();

    const registroData = {
      ...formData,
      password: hashedPassword,
    };

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/registro', registroData);
      setMensaje('Usuario registrado exitosamente');
      console.log(response.data);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMensaje('Error al registrar usuario');
    }
  };
   // Validación para el nombre
   if (name === 'nombre') {
    if (!nameRegex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nombre: 'El nombre debe contener solo letras.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nombre: '', // Limpia el error si la validación es correcta
      }));
    }
  }
  // Validación para apellido paterno
  if (name === 'apellidoPaterno') {
    if (!nameRegex.test(trimmedValue)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apellidoPaterno: 'El apellido paterno debe contener solo letras.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apellidoPaterno: '',
      }));
    }
  }
   // Validación para apellido materno
   if (name === 'apellidoMaterno') {
    if (!nameRegex.test(trimmedValue)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apellidoMaterno: 'El apellido materno debe contener solo letras.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apellidoMaterno: '',
      }));
    }
  }
  // Validación para correo
  if (name === 'correo') {
    if (!emailRegex.test(trimmedValue)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        correo: 'El correo electrónico no es válido.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        correo: '',
      }));
    }
  }
  // Validación para teléfono
  if (name === 'telefono') {
    if (!phoneRegex.test(trimmedValue)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        telefono: 'El teléfono debe contener 10 dígitos numéricos.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        telefono: '',
      }));
    }
  }
  return (
    // JSX para renderizar el formulario
    <Container>
      {/* Formulario aquí */}
    </Container>
  );
};
export default Registro;

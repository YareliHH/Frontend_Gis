import React, { useState } from 'react';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Regex para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailValue)) {
      setEmailError('El correo electrónico no es válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailError && email) {
      // Aquí puedes agregar la lógica para enviar o procesar el correo
      alert(`Correo válido: ${email}`);
    } else {
      alert('Por favor, ingrese un correo electrónico válido.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Correo electrónico:
          <input 
            type="email" 
            value={email} 
            onChange={validateEmail} 
            required
          />
        </label>
        {emailError && <p style={{color: 'red'}}>{emailError}</p>}
        <button type="submit">Verificar</button>
      </form>
    </div>
  );
};

export default EmailVerification;

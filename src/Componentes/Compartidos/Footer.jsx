import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#00bcd4', color: '#ffffff', padding: '20px', textAlign: 'center', position: 'fixed', width: '100%', bottom: 0 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Atención al Cliente */}
        <div>
          <h4>Atención al Cliente</h4>
          <p>
            Teléfono: <a href="tel:+1234567890" style={{ color: '#ffffff' }}>7711730977</a><br />
            Correo: <a href="mailto:atencion@gislive.com" style={{ color: '#ffffff' }}>Jehiely_24@hotmail.com</a>
          </p>
        </div>
        
        {/* Redes Sociales */}
        <div>
          <h4>Síguenos en nuestras redes sociales</h4>
          <div>
            <Link to={{ pathname: "https://www.facebook.com" }} target="_blank" style={{ margin: '0 10px', color: '#ffffff' }}>
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </Link>
            <Link to={{ pathname: "https://www.instagram.com" }} target="_blank" style={{ margin: '0 10px', color: '#ffffff' }}>
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </Link>
            <Link to="mailto:atencion@gislive.com" style={{ margin: '0 10px', color: '#ffffff' }}>
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
            </Link>
          </div>
        </div>
        
      </div>
      
      <p style={{ marginTop: '10px' }}>© 2024 Gislive. Todos los derechos reservados.</p>
      
    </footer>
  );
}

export default Footer;

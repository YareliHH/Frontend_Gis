import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('./Componentes/Autenticacion/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    usuario: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false
  })
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
    expect(container).toBeInTheDocument();
  });

  test('renders app with router', () => {
    const { container } = render(<App />);
    
    // Verifica que el container tenga contenido
    expect(container.innerHTML).toBeTruthy();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  test('app is rendered in the document', () => {
    render(<App />);
    
    // Simplemente verifica que se renderiza sin errores
    expect(document.body).toBeInTheDocument();
  });
});
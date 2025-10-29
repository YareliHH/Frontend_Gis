// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock de axios para evitar llamadas reales
import axios from 'axios';
jest.mock('axios');

// Configurar valores por defecto de axios mock
axios.get = jest.fn().mockResolvedValue({ data: [] });
axios.post = jest.fn().mockResolvedValue({ data: {} });
axios.put = jest.fn().mockResolvedValue({ data: {} });
axios.delete = jest.fn().mockResolvedValue({ data: {} });

// Mock de URL.createObjectURL y revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock de window.confirm
global.confirm = jest.fn(() => true);

// Suprimir warnings específicos de React y componentes
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn((...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: useLayoutEffect') ||
       args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
       args[0].includes('Warning: React.jsx: type is invalid') ||
       args[0].includes('Error al verificar autenticación'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  });

  console.warn = jest.fn((...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React Router')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
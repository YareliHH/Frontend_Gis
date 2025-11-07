/* eslint-disable testing-library/prefer-presence-queries */
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Insignias from './Insignias';

// Mock de axios
jest.mock('axios');

// Datos de prueba
const mockInsignias = [
  {
    id: 1,
    nombre: 'Explorador',
    descripcion: 'Primera insignia',
    tipo: 'Bronce',
    regla: 'Visitar 5 lugares',
    icono_url: 'https://example.com/icon1.png',
  },
  {
    id: 2,
    nombre: 'Contribuidor',
    descripcion: 'Segunda insignia',
    tipo: 'Plata',
    regla: 'Agregar 10 comentarios',
    icono_url: 'https://example.com/icon2.png',
  },
];

describe('Insignias Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: [] });
  });

  describe('Renderizado inicial', () => {
    test('renderiza el título principal', async () => {
      axios.get.mockResolvedValue({ data: mockInsignias });

      render(<Insignias />);

      const titulo = await screen.findByText('Gestión de Insignias');
      expect(titulo).toBeInTheDocument();
    });

    test('muestra el botón de nueva insignia', async () => {
      axios.get.mockResolvedValue({ data: [] });

      render(<Insignias />);

      await waitFor(() => {
        const botones = screen.getAllByRole('button');
        const botonNueva = botones.find(btn => btn.textContent.includes('Nueva Insignia'));
        expect(botonNueva).toBeInTheDocument();
      });
    });

    test('carga y muestra las insignias existentes', async () => {
      axios.get.mockResolvedValue({ data: mockInsignias });

      render(<Insignias />);

      await waitFor(() => {
        const elementos = screen.getAllByText('Explorador');
        expect(elementos.length).toBeGreaterThan(0);
      });

      const contribuidor = screen.getAllByText('Contribuidor');
      expect(contribuidor.length).toBeGreaterThan(0);
    });

    test('muestra mensaje cuando no hay insignias', async () => {
      axios.get.mockResolvedValue({ data: [] });

      render(<Insignias />);

      await waitFor(() => {
        expect(screen.getByText(/no hay insignias registradas/i)).toBeInTheDocument();
      });
    });

    test('maneja errores al cargar insignias', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValue(new Error('Error de red'));

      render(<Insignias />);

      await waitFor(() => {
        expect(screen.getByText(/error al cargar las insignias/i)).toBeInTheDocument();
      });

      consoleError.mockRestore();
    });
  });

  describe('Crear insignia', () => {
    test('abre el modal al hacer clic en Nueva Insignia', async () => {
      axios.get.mockResolvedValue({ data: [] });
      const user = userEvent.setup();

      render(<Insignias />);

      await waitFor(() => {
        expect(screen.queryByText(/no hay insignias/i)).toBeInTheDocument();
      });

      const botones = screen.getAllByRole('button');
      const btnNueva = botones.find(btn => btn.textContent.includes('Nueva Insignia'));
      await user.click(btnNueva);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Verificar que el diálogo tiene el título correcto
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('Nueva Insignia')).toBeInTheDocument();
    });

    test('valida campos obligatorios al crear', async () => {
      axios.get.mockResolvedValue({ data: [] });
      const user = userEvent.setup();

      render(<Insignias />);

      await waitFor(() => {
        expect(screen.queryByText(/no hay insignias/i)).toBeInTheDocument();
      });

      const botones = screen.getAllByRole('button');
      const btnNueva = botones.find(btn => btn.textContent.includes('Nueva Insignia'));
      await user.click(btnNueva);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Buscar el input por placeholder o por su posición en el formulario
      const inputs = screen.getAllByRole('textbox');
      const nombreInput = inputs[0]; // Primer input es "Nombre"
      
      await user.type(nombreInput, 'Solo Nombre');

      const botonesDialog = within(screen.getByRole('dialog')).getAllByRole('button');
      const btnCrear = botonesDialog.find(btn => btn.textContent.includes('Crear'));
      await user.click(btnCrear);

      await waitFor(() => {
        expect(screen.getByText(/completa todos los campos obligatorios/i)).toBeInTheDocument();
      });

      expect(axios.post).not.toHaveBeenCalled();
    });

    test('crea una insignia correctamente con todos los campos', async () => {
      axios.get.mockResolvedValue({ data: [] });
      axios.post.mockResolvedValue({ data: { success: true } });
      const user = userEvent.setup();

      render(<Insignias />);

      await waitFor(() => {
        expect(screen.queryByText(/no hay insignias/i)).toBeInTheDocument();
      });

      const botones = screen.getAllByRole('button');
      const btnNueva = botones.find(btn => btn.textContent.includes('Nueva Insignia'));
      await user.click(btnNueva);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Llenar formulario usando los inputs en orden
      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'Nueva Insignia'); // Nombre
      await user.type(inputs[1], 'Descripción de prueba'); // Descripción
      await user.type(inputs[2], 'Oro'); // Tipo
      await user.type(inputs[3], 'Completar 20 tareas'); // Regla

      axios.get.mockResolvedValue({
        data: [{
          id: 3,
          nombre: 'Nueva Insignia',
          descripcion: 'Descripción de prueba',
          tipo: 'Oro',
          regla: 'Completar 20 tareas',
          icono_url: ''
        }]
      });

      const botonesDialog = within(screen.getByRole('dialog')).getAllByRole('button');
      const btnCrear = botonesDialog.find(btn => btn.textContent.includes('Crear'));
      await user.click(btnCrear);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/crear'),
          expect.any(FormData),
          expect.objectContaining({
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }, { timeout: 3000 });
    });
  });

  describe('Editar insignia', () => {
    test('carga los datos al editar', async () => {
      axios.get.mockResolvedValue({ data: mockInsignias });
      const user = userEvent.setup();

      render(<Insignias />);

      await waitFor(() => {
        const elementos = screen.getAllByText('Explorador');
        expect(elementos.length).toBeGreaterThan(0);
      });

      axios.get.mockResolvedValueOnce({ data: mockInsignias[0] });

      const editButtons = screen.getAllByRole('button', { name: /editar/i });
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verificar que el diálogo tiene el título correcto
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('Editar Insignia')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByDisplayValue('Explorador')).toBeInTheDocument();
      });
    });

    test('actualiza una insignia correctamente', async () => {
      axios.get.mockResolvedValue({ data: mockInsignias });
      axios.put.mockResolvedValue({ data: { success: true } });
      const user = userEvent.setup();

      render(<Insignias />);

      await waitFor(() => {
        const elementos = screen.getAllByText('Explorador');
        expect(elementos.length).toBeGreaterThan(0);
      });

      axios.get.mockResolvedValueOnce({ data: mockInsignias[0] });

      const editButtons = screen.getAllByRole('button', { name: /editar/i });
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('Explorador')).toBeInTheDocument();
      });

      const nombreInput = screen.getByDisplayValue('Explorador');
      await user.clear(nombreInput);
      await user.type(nombreInput, 'Explorador Avanzado');

      axios.get.mockResolvedValue({
        data: [{
          ...mockInsignias[0],
          nombre: 'Explorador Avanzado'
        }]
      });

      const botonesDialog = within(screen.getByRole('dialog')).getAllByRole('button');
      const btnActualizar = botonesDialog.find(btn => btn.textContent.includes('Actualizar'));
      await user.click(btnActualizar);

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
      });
    });
  });

  describe('Eliminar insignia', () => {
    test('elimina una insignia con confirmación', async () => {
      axios.get.mockResolvedValue({ data: mockInsignias });
      axios.delete.mockResolvedValue({ data: { success: true } });
      global.confirm = jest.fn(() => true);
      const user = userEvent.setup();

      render(<Insignias />);

      await waitFor(() => {
        const elementos = screen.getAllByText('Explorador');
        expect(elementos.length).toBeGreaterThan(0);
      });

      const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
      await user.click(deleteButtons[0]);

      expect(global.confirm).toHaveBeenCalledWith('¿Seguro que deseas eliminar esta insignia?');

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/insignias/1'));
      });
    });

    test('no elimina si el usuario cancela', async () => {
      axios.get.mockResolvedValue({ data: mockInsignias });
      global.confirm = jest.fn(() => false);
      const user = userEvent.setup();

      render(<Insignias />);

      await waitFor(() => {
        const elementos = screen.getAllByText('Explorador');
        expect(elementos.length).toBeGreaterThan(0);
      });

      const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
      await user.click(deleteButtons[0]);

      expect(global.confirm).toHaveBeenCalled();
      expect(axios.delete).not.toHaveBeenCalled();
    });
  });

  describe('Cerrar modal', () => {
    test('limpia el formulario al cerrar', async () => {
      axios.get.mockResolvedValue({ data: [] });
      const user = userEvent.setup();

      render(<Insignias />);

      await waitFor(() => {
        expect(screen.queryByText(/no hay insignias/i)).toBeInTheDocument();
      });

      const botones = screen.getAllByRole('button');
      const btnNueva = botones.find(btn => btn.textContent.includes('Nueva Insignia'));
      await user.click(btnNueva);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const inputs = screen.getAllByRole('textbox');
      await user.type(inputs[0], 'Test');

      const botonesDialog = within(screen.getByRole('dialog')).getAllByRole('button');
      const btnCancelar = botonesDialog.find(btn => btn.textContent.includes('Cancelar'));
      await user.click(btnCancelar);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Abrir de nuevo y verificar que está limpio
      const botonesNuevamente = screen.getAllByRole('button');
      const btnNueva2 = botonesNuevamente.find(btn => btn.textContent.includes('Nueva Insignia'));
      await user.click(btnNueva2);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const inputsLimpios = screen.getAllByRole('textbox');
      expect(inputsLimpios[0]).toHaveValue('');
    });
  });
});
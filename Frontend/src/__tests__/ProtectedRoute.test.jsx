import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('sin autenticacion', () => {
    it('redirige a "/" si no hay usuario en localStorage', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <ProtectedRoute rolPermitido="Administrador">
            <div>Panel secreto</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.queryByText('Panel secreto')).not.toBeInTheDocument();
    });
  });

  describe('con autenticacion pero rol incorrecto', () => {
    it('redirige a "/" si el rol no coincide', () => {
      localStorage.setItem('usuario', JSON.stringify({ id: 1, rol: 'Cliente' }));
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <ProtectedRoute rolPermitido="Administrador">
            <div>Panel Admin</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.queryByText('Panel Admin')).not.toBeInTheDocument();
    });
  });

  describe('con autenticacion y rol correcto', () => {
    it('renderiza children para Administrador', () => {
      localStorage.setItem('usuario', JSON.stringify({ id: 1, rol: 'Administrador' }));
      render(
        <MemoryRouter>
          <ProtectedRoute rolPermitido="Administrador">
            <div>Bienvenido Admin</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.getByText('Bienvenido Admin')).toBeInTheDocument();
    });

    it('renderiza children para Entrenador', () => {
      localStorage.setItem('usuario', JSON.stringify({ id: 2, rol: 'Entrenador' }));
      render(
        <MemoryRouter>
          <ProtectedRoute rolPermitido="Entrenador">
            <div>Panel Entrenador</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.getByText('Panel Entrenador')).toBeInTheDocument();
    });

    it('renderiza children para Cliente', () => {
      localStorage.setItem('usuario', JSON.stringify({ id: 3, rol: 'Cliente' }));
      render(
        <MemoryRouter>
          <ProtectedRoute rolPermitido="Cliente">
            <div>Mi Perfil</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
    });
  });

  describe('sin rolPermitido especificado', () => {
    it('permite acceso a cualquier usuario autenticado', () => {
      localStorage.setItem('usuario', JSON.stringify({ id: 1, rol: 'Cliente' }));
      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div>Ruta para cualquier logueado</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.getByText('Ruta para cualquier logueado')).toBeInTheDocument();
    });

    it('sigue redirigiendo si no hay usuario', () => {
      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div>No deberia verse</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
      expect(screen.queryByText('No deberia verse')).not.toBeInTheDocument();
    });
  });
});

import { describe, it, expect } from 'vitest';
import { esCorreoValido } from '../utils/validation';

describe('Login - validacion de correo', () => {
  it('valida formatos de email reales', () => {
    const validos = [
      'admin@gymcontrol.com',
      'juan.perez@gmail.com',
      'entrenador@outlook.es',
      'cliente+test@hotmail.com',
    ];
    validos.forEach(email => expect(esCorreoValido(email)).toBe(true));
  });

  it('rechaza formatos invalidos', () => {
    const invalidos = [
      '', 'invalido', 'sinarroba', '@sueltocom',
      'usuario@', '@.com', 'a@b,com', 'a@b c.com',
    ];
    invalidos.forEach(email => expect(esCorreoValido(email)).toBe(false));
  });

  it('usa exactamente la misma regex que el componente Login', () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(regex.test('admin@gym.com')).toBe(true);
    expect(regex.test('not-email')).toBe(false);
  });
});

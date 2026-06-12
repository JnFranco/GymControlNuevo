import { describe, it, expect } from 'vitest';
import {
  passwordsMatch,
  sanitizePhone,
  isValidPassword,
} from '../utils/validation';

describe('Register - validacion de contrasenas', () => {
  it('detecta cuando coinciden exactamente', () => {
    expect(passwordsMatch('GymControl2024!', 'GymControl2024!')).toBe(true);
  });

  it('detecta cuando no coinciden', () => {
    expect(passwordsMatch('GymControl2024!', 'gymcontrol2024!')).toBe(false);
    expect(passwordsMatch('123456', '123455')).toBe(false);
  });

  it('claves vacias coinciden (ambas vacias)', () => {
    expect(passwordsMatch('', '')).toBe(true);
  });
});

describe('Register - sanitizacion de telefono', () => {
  it('limpia numero telefonico correctamente', () => {
    expect(sanitizePhone('987-654-321')).toBe('987654321');
    expect(sanitizePhone('+51 987 654 321')).toBe('51987654321');
    expect(sanitizePhone('(01) 234-5678')).toBe('012345678');
  });

  it('solo deja digitos', () => {
    expect(sanitizePhone('abc123def456')).toBe('123456');
    expect(sanitizePhone('telefono: 999888777')).toBe('999888777');
  });
});

describe('Register - validacion de longitud de contrasena', () => {
  it('acepta 6 o mas caracteres', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('abcdef')).toBe(true);
    expect(isValidPassword('Gym2024!')).toBe(true);
  });

  it('rechaza menos de 6 caracteres', () => {
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword('1')).toBe(false);
    expect(isValidPassword('abcde')).toBe(false);
    expect(isValidPassword('12345')).toBe(false);
  });
});

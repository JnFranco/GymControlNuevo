import { describe, it, expect } from 'vitest';
import {
  esCorreoValido,
  sanitizePhone,
  passwordsMatch,
  isValidPassword,
  calcularPromedioAsistencias,
  calcularTotalPendiente,
  calcularTotalAtrasado,
} from '../utils/validation';

describe('esCorreoValido', () => {
  it('acepta emails validos comunes', () => {
    expect(esCorreoValido('user@example.com')).toBe(true);
    expect(esCorreoValido('admin@gym.com')).toBe(true);
    expect(esCorreoValido('juan.perez@outlook.es')).toBe(true);
  });

  it('acepta emails con subdominios y tags', () => {
    expect(esCorreoValido('user+tag@domain.co')).toBe(true);
    expect(esCorreoValido('test@sub.domain.com')).toBe(true);
  });

  it('rechaza strings sin @', () => {
    expect(esCorreoValido('')).toBe(false);
    expect(esCorreoValido('notanemail')).toBe(false);
    expect(esCorreoValido('user@')).toBe(false);
    expect(esCorreoValido('@domain')).toBe(false);
    expect(esCorreoValido('user@.com')).toBe(false);
  });
});

describe('sanitizePhone', () => {
  it('elimina guiones, espacios y parentesis', () => {
    expect(sanitizePhone('987-654-321')).toBe('987654321');
    expect(sanitizePhone('(555) 123-4567')).toBe('5551234567');
  });

  it('elimina letras', () => {
    expect(sanitizePhone('abc123def')).toBe('123');
    expect(sanitizePhone('tel: 999888777')).toBe('999888777');
  });

  it('string vacio si solo hay no numericos', () => {
    expect(sanitizePhone('abc')).toBe('');
  });
});

describe('passwordsMatch', () => {
  it('true cuando ambas claves son iguales', () => {
    expect(passwordsMatch('Admin123!', 'Admin123!')).toBe(true);
    expect(passwordsMatch('', '')).toBe(true);
  });

  it('false cuando son diferentes', () => {
    expect(passwordsMatch('123456', '123457')).toBe(false);
    expect(passwordsMatch('abc', 'ABC')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('true para 6 o mas caracteres', () => {
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('admin123')).toBe(true);
    expect(isValidPassword('a'.repeat(20))).toBe(true);
  });

  it('false para menos de 6 caracteres', () => {
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword('1')).toBe(false);
    expect(isValidPassword('12345')).toBe(false);
  });
});

describe('calcularPromedioAsistencias', () => {
  it('calcula promedio correcto con datos', () => {
    expect(calcularPromedioAsistencias([
      { asistencias: 10 }, { asistencias: 20 }, { asistencias: 30 },
    ])).toBe(20);
  });

  it('maneja asistencias en string', () => {
    expect(calcularPromedioAsistencias([
      { asistencias: '5' }, { asistencias: '15' },
    ])).toBe(10);
  });

  it('retorna 0 si el array esta vacio', () => {
    expect(calcularPromedioAsistencias([])).toBe(0);
  });

  it('redondea correctamente decimales', () => {
    expect(calcularPromedioAsistencias([
      { asistencias: 10 }, { asistencias: 11 },
    ])).toBe(11);
  });

  it('ignora valores undefined/null/missing', () => {
    expect(calcularPromedioAsistencias([
      { asistencias: undefined }, { asistencias: 10 },
    ])).toBe(5);
  });
});

describe('calcularTotalPendiente', () => {
  it('suma montos en string', () => {
    expect(calcularTotalPendiente([
      { monto: '100' }, { monto: '200' }, { monto: '50' },
    ])).toBe(350);
  });

  it('suma montos en number', () => {
    expect(calcularTotalPendiente([
      { monto: 100 }, { monto: 200 },
    ])).toBe(300);
  });

  it('maneja decimales', () => {
    expect(calcularTotalPendiente([
      { monto: '99.99' }, { monto: '0.01' },
    ])).toBe(100);
  });

  it('retorna 0 si no hay pagos', () => {
    expect(calcularTotalPendiente([])).toBe(0);
  });
});

describe('calcularTotalAtrasado', () => {
  it('suma montos de pagos atrasados', () => {
    expect(calcularTotalAtrasado([
      { monto: '150' }, { monto: '75.50' },
    ])).toBe(225.5);
  });
});

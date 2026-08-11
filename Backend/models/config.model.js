const db = require('../db/connection');

const DEFAULT_CONFIG = {
  nombreGimnasio: "Gym Control",
  direccion: "",
  telefono: "",
  correo: "",
  cuposDefecto: 10,
  maxReservas: 3,
  cancelarHoras: 2,
  sistemaActivo: true,
  reservasActivas: true,
  pagosActivos: true,
  exportarPDF: true,
  exportarExcel: true,
  forzarPassword: false,
  tiempoSesion: 30
};

async function asegurarTabla() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS config_sistema (
      id TINYINT PRIMARY KEY,
      valor JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await db.query('SELECT valor FROM config_sistema WHERE id = 1');
  if (rows.length === 0) {
    await db.query(
      'INSERT INTO config_sistema (id, valor) VALUES (1, ?)',
      [JSON.stringify(DEFAULT_CONFIG)]
    );
  }
}

async function obtenerConfig() {
  await asegurarTabla();
  const [rows] = await db.query('SELECT valor FROM config_sistema WHERE id = 1');
  if (rows.length === 0) return { ...DEFAULT_CONFIG };

  let guardada = {};
  try {
    guardada = typeof rows[0].valor === 'string' ? JSON.parse(rows[0].valor) : rows[0].valor;
  } catch (error) {
    guardada = {};
  }

  return { ...DEFAULT_CONFIG, ...guardada };
}

async function actualizarConfig(config) {
  await asegurarTabla();
  const actual = await obtenerConfig();
  const nuevo = { ...actual, ...config };

  // Política "forzar cambio de contraseña": al activarla, todos deben cambiarla en su próximo ingreso
  if (nuevo.forzarPassword === true && actual.forzarPassword !== true) {
    await db.query('UPDATE usuarios SET debe_cambiar_password = 1 WHERE activo = 1');
  }
  if (nuevo.forzarPassword === false && actual.forzarPassword !== false) {
    await db.query('UPDATE usuarios SET debe_cambiar_password = 0');
  }

  await db.query(
    'UPDATE config_sistema SET valor = ? WHERE id = 1',
    [JSON.stringify(nuevo)]
  );
  return nuevo;
}

module.exports = {
  DEFAULT_CONFIG,
  obtenerConfig,
  actualizarConfig
};

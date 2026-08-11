const db = require("../db/connection");

function manejarError(res, error, contexto) {
  console.error(`❌ Error en ${contexto}:`, error);
  res.status(500).json({ error: 'Error interno del servidor' });
}

exports.reporteUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
        CONCAT(nombre, ' ', apellido) AS usuario,
        correo,
        CASE id_rol
            WHEN 1 THEN 'Administrador'
            WHEN 2 THEN 'Entrenador'
            WHEN 3 THEN 'Cliente'
        END AS rol,
        activo
        FROM usuarios
    `);
    res.json(rows);
  } catch (error) {
    manejarError(res, error, 'reporteUsuarios');
  }
};

exports.reporteEntrenadores = async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
        CONCAT(u.nombre, ' ', u.apellido) AS entrenador,
        COUNT(c.id) AS clases_asignadas,
        u.activo
        FROM usuarios u
        LEFT JOIN clases c ON c.id_entrenador = u.id
        WHERE u.id_rol = 2
        GROUP BY u.id
    `);
    res.json(rows);
  } catch (error) {
    manejarError(res, error, 'reporteEntrenadores');
  }
};

exports.reporteClases = async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
        c.nombre AS clase,
        CONCAT(u.nombre, ' ', u.apellido) AS entrenador,
        c.cupos,
        c.activo
        FROM clases c
        LEFT JOIN usuarios u ON c.id_entrenador = u.id
    `);
    res.json(rows);
  } catch (error) {
    manejarError(res, error, 'reporteClases');
  }
};

exports.reporteMembresias = async (req, res) => {
  try {
    const [rows] = await db.query(`
        SELECT 
        CONCAT(u.nombre, ' ', u.apellido) AS usuario,
        m.nombre AS membresia,
        p.estado,
        p.fecha_pago
        FROM pagos p
        INNER JOIN usuarios u ON u.id = p.id_usuario
        INNER JOIN membresias m ON m.id = p.id_membresia
    `);
    res.json(rows);
  } catch (error) {
    manejarError(res, error, 'reporteMembresias');
  }
};

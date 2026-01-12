

const db = require("../db/connection");

exports.reporteUsuarios = async (req, res) => {
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
};

exports.reporteEntrenadores = async (req, res) => {
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
};

exports.reporteClases = async (req, res) => {
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
};

exports.reporteMembresias = async (req, res) => {
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
};

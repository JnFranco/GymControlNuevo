const db = require('../db/connection');

exports.getResumen = async (req, res) => {
  try {
    // 1. Contar clientes (id_rol = 3)
    const [clientes] = await db.execute('SELECT COUNT(*) as total FROM usuarios WHERE id_rol = 3 AND activo = 1');
    
    // 2. Contar entrenadores (id_rol = 2)
    const [entrenadores] = await db.execute('SELECT COUNT(*) as total FROM usuarios WHERE id_rol = 2 AND activo = 1');
    
    // 3. Contar clases activas
    const [clases] = await db.execute('SELECT COUNT(*) as total FROM clases');

    res.json({
      clientes: clientes[0].total,
      entrenadores: entrenadores[0].total,
      clasesHoy: clases[0].total,
      ingresos: 15240 // Aquí podrías sumar pagos si tienes la tabla
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEstadisticas = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        DATE_FORMAT(fecha_asistencia, '%W') AS dia,
        COUNT(*) AS asistencias
      FROM asistencias
      WHERE presente = 1
        AND fecha_asistencia >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY dia
      ORDER BY fecha_asistencia
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


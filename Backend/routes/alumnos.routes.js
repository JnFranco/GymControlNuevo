const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET - Obtener alumnos de un instructor con su última asistencia
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    console.log('🔍 Obteniendo alumnos del instructor:', instructorId);
    
    const query = `
      SELECT DISTINCT
        u.id AS alumno_id,
        u.nombre,
        u.apellido,
        u.correo,
        u.telefono,
        c.nombre AS clase_nombre,
        c.id AS clase_id,
        MAX(a.fecha_asistencia) AS ultima_asistencia,
        COUNT(DISTINCT a.id) AS total_asistencias
      FROM usuarios u
      INNER JOIN reservas r ON r.id_usuario = u.id
      INNER JOIN horarios h ON h.id = r.id_horario
      INNER JOIN clases c ON c.id = h.id_clase
      LEFT JOIN asistencias a ON a.id_reserva = r.id AND a.presente = TRUE
      WHERE c.id_entrenador = ?
        AND r.estado = 'Confirmada'
      GROUP BY u.id, u.nombre, u.apellido, u.correo, u.telefono, c.nombre, c.id
      ORDER BY u.nombre ASC, u.apellido ASC
    `;
    
    const [alumnos] = await db.query(query, [instructorId]);
    
    console.log(`✅ Se encontraron ${alumnos.length} alumnos`);
    
    res.json(alumnos);
    
  } catch (error) {
    console.error('❌ Error al obtener alumnos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los alumnos',
      details: error.message 
    });
  }
});

// GET - Obtener clases de un alumno específico con un instructor
router.get('/instructor/:instructorId/alumno/:alumnoId', async (req, res) => {
  try {
    const { instructorId, alumnoId } = req.params;
    
    console.log('🔍 Obteniendo clases del alumno:', alumnoId, 'con instructor:', instructorId);
    
    const query = `
      SELECT DISTINCT
        c.id AS clase_id,
        c.nombre AS clase_nombre,
        c.descripcion,
        COUNT(DISTINCT a.id) AS total_asistencias,
        MAX(a.fecha_asistencia) AS ultima_asistencia
      FROM clases c
      INNER JOIN horarios h ON h.id_clase = c.id
      INNER JOIN reservas r ON r.id_horario = h.id
      LEFT JOIN asistencias a ON a.id_reserva = r.id AND a.presente = TRUE
      WHERE c.id_entrenador = ?
        AND r.id_usuario = ?
        AND r.estado = 'Confirmada'
      GROUP BY c.id, c.nombre, c.descripcion
      ORDER BY c.nombre ASC
    `;
    
    const [clases] = await db.query(query, [instructorId, alumnoId]);
    
    console.log(`✅ Se encontraron ${clases.length} clases`);
    
    res.json(clases);
    
  } catch (error) {
    console.error('❌ Error al obtener clases del alumno:', error);
    res.status(500).json({ 
      error: 'Error al obtener las clases del alumno',
      details: error.message 
    });
  }
});

module.exports = router;
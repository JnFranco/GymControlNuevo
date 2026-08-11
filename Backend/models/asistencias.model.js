const db = require('../db/connection');

// ✅ Obtener todas las asistencias con información del usuario y la clase
async function obtenerAsistencias() {
  const [rows] = await db.query(`
    SELECT a.id, 
           u.nombre AS usuario,
           c.nombre AS clase,
           a.presente, 
           a.fecha_asistencia
    FROM asistencias a
    JOIN reservas r ON a.id_reserva = r.id
    JOIN usuarios u ON r.id_usuario = u.id
    JOIN horarios h ON r.id_horario = h.id
    JOIN clases c ON h.id_clase = c.id
    ORDER BY a.fecha_asistencia DESC
  `);
  return rows;
}

// ✅ Obtener asistencia por ID
async function obtenerAsistenciaPorId(id) {
  const [rows] = await db.query('SELECT * FROM asistencias WHERE id = ?', [id]);
  return rows[0];
}

// ✅ Registrar asistencia
async function registrarAsistencia({ id_reserva, presente }) {
  const [result] = await db.query(
    'INSERT INTO asistencias (id_reserva, presente, fecha_asistencia) VALUES (?, ?, CURRENT_DATE)',
    [id_reserva, presente]
  );
  return result.insertId;
}

// ✅ Actualizar asistencia
async function actualizarAsistencia(id, { presente }) {
  const [result] = await db.query(
    'UPDATE asistencias SET presente = ? WHERE id = ?',
    [presente, id]
  );
  return result.affectedRows;
}

// ✅ Eliminar asistencia
async function eliminarAsistencia(id) {
  const [result] = await db.query('DELETE FROM asistencias WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = {
  obtenerAsistencias,
  obtenerAsistenciaPorId,
  registrarAsistencia,
  actualizarAsistencia,
  eliminarAsistencia,
};
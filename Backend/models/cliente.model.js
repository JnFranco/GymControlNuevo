const db = require('../db/connection');

const ClienteModel = {
  getDashboard: async (id) => {
    console.log(`--[DB] Iniciando consulta para ID: ${id}--`);
    const query = `
      SELECT 
        (SELECT m.nombre FROM pagos p 
         JOIN membresias m ON p.id_membresia = m.id 
         WHERE p.id_usuario = ? ORDER BY p.fecha_pago DESC LIMIT 1) as nombre_membresia,
        (SELECT p.fecha_pago FROM pagos p 
         WHERE p.id_usuario = ? ORDER BY p.fecha_pago DESC LIMIT 1) as ultima_fecha,
        (SELECT m.duracion_dias FROM pagos p 
         JOIN membresias m ON p.id_membresia = m.id 
         WHERE p.id_usuario = ? ORDER BY p.fecha_pago DESC LIMIT 1) as duracion,
        (SELECT COUNT(*) FROM asistencias a 
         JOIN reservas r ON a.id_reserva = r.id 
         WHERE r.id_usuario = ? AND a.presente = 1) as total_asistencias,
        (SELECT COUNT(*) FROM reservas WHERE id_usuario = ? AND estado = 'Confirmada') as total_reservas
    `;
    
    // Con mysql2/promise se usa await y desestructuración [rows]
    const [rows] = await db.query(query, [id, id, id, id, id]);
    console.log("✅ [DB Success]: Datos obtenidos");
    return rows;
  },

  // ✅ MODIFICADO PARA CLASESVIEW
  getClases_cli: async (idUsuario) => {
    const query = `
      SELECT 
        h.id AS horario_id,
        c.nombre AS clase_nombre,
        CONCAT(u.nombre, ' ', u.apellido) AS entrenador,
        h.dia_semana,
        TIME_FORMAT(h.hora_inicio, '%H:%i') as hora_inicio,
        TIME_FORMAT(h.hora_fin, '%H:%i') as hora_fin,
        h.capacidad - (SELECT COUNT(*) FROM reservas r2 WHERE r2.id_horario = h.id AND r2.estado = 'Confirmada') AS cupos_disponibles,
        IF(EXISTS(SELECT 1 FROM reservas r3 WHERE r3.id_horario = h.id AND r3.id_usuario = ? AND r3.estado = 'Confirmada'), 1, 0) AS reservado
      FROM horarios h
      JOIN clases c ON c.id = h.id_clase
      JOIN usuarios u ON u.id = c.id_entrenador
      WHERE c.activo = 1
      ORDER BY FIELD(h.dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'), h.hora_inicio
    `;
    const [rows] = await db.query(query, [idUsuario]);
    return rows;
  },

  reservar_cli: async (idUsuario, idHorario) => {
    const query = `INSERT INTO reservas (id_usuario, id_horario, estado) VALUES (?, ?, 'Confirmada')`;
    return await db.query(query, [idUsuario, idHorario]);
  },

  cancelar_cli: async (idUsuario, idHorario) => {
    const query = `UPDATE reservas SET estado = 'Cancelada' WHERE id_usuario = ? AND id_horario = ? AND estado = 'Confirmada'`;
    return await db.query(query, [idUsuario, idHorario]);
  }
};

module.exports = ClienteModel;
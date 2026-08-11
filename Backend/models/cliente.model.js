const db = require('../db/connection');
const ReservasModel = require('../models/reservas.model');

const ClienteModel = {
  getDashboard: async (id) => {
    console.log(`--[DB] Iniciando consulta para ID: ${id}--`);
    const query = `
      SELECT 
        p.id AS pago_id,
        p.estado AS estado_pago,
        p.fecha_pago AS ultima_fecha,
        m.nombre AS nombre_membresia,
        m.duracion_dias AS duracion,
        DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY) AS fecha_fin,
        (SELECT COUNT(*) FROM asistencias a 
         JOIN reservas r ON a.id_reserva = r.id 
         WHERE r.id_usuario = ? AND a.presente = 1) as total_asistencias,
        (SELECT COUNT(*) FROM asistencias a 
         JOIN reservas r ON a.id_reserva = r.id 
         WHERE r.id_usuario = ? AND a.presente = 1
           AND MONTH(a.fecha_asistencia) = MONTH(CURDATE())
           AND YEAR(a.fecha_asistencia) = YEAR(CURDATE())) as asistencias_mes,
        (SELECT COUNT(*) FROM reservas WHERE id_usuario = ? AND estado = 'Confirmada') as total_reservas
      FROM pagos p
      JOIN membresias m ON m.id = p.id_membresia
      WHERE p.id = (SELECT MAX(p2.id) FROM pagos p2 WHERE p2.id_usuario = ?)
    `;
    
    // Con mysql2/promise se usa await y desestructuración [rows]
    const [rows] = await db.query(query, [id, id, id, id]);
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
    return await ReservasModel.crearReserva(idUsuario, idHorario);
  },

  cancelar_cli: async (idUsuario, idHorario) => {
    return await ReservasModel.cancelarReserva(idUsuario, idHorario);
  }
};

module.exports = ClienteModel;
const db = require("../db/connection");

// 📌 Obtener clases disponibles con horarios y cupos
exports.obtenerClasesDisponibles = async (req, res) => {
  const { dia } = req.query;

  try {
    const [rows] = await db.query(`
      SELECT 
        h.id AS horario_id,
        c.nombre AS clase_nombre,
        u.nombre AS entrenador,
        h.dia_semana,
        h.hora_inicio,
        h.hora_fin,
        h.capacidad - COUNT(r.id) AS cupos_disponibles,
        IF(MAX(r.id_usuario = ?), 1, 0) AS reservado
      FROM horarios h
      JOIN clases c ON c.id = h.id_clase
      JOIN usuarios u ON u.id = c.id_entrenador
      LEFT JOIN reservas r 
        ON r.id_horario = h.id AND r.estado = 'Confirmada'
      WHERE c.activo = 1
        ${dia ? "AND h.dia_semana = ?" : ""}
      GROUP BY h.id
      ORDER BY h.hora_inicio
    `, dia ? [req.usuario.id, dia] : [req.usuario.id]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener clases" });
  }
};

// 📌 Reservar clase
exports.reservarClase = async (req, res) => {
  const { idHorario } = req.body;

  try {
    await db.query(`
      INSERT INTO reservas (id_usuario, id_horario, estado)
      VALUES (?, ?, 'Confirmada')
    `, [req.usuario.id, idHorario]);

    res.json({ message: "Clase reservada" });
  } catch (error) {
    res.status(500).json({ message: "Error al reservar" });
  }
};

// 📌 Cancelar reserva
exports.cancelarReserva = async (req, res) => {
  const { idHorario } = req.params;

  try {
    await db.query(`
      UPDATE reservas
      SET estado = 'Cancelada'
      WHERE id_usuario = ? AND id_horario = ?
    `, [req.usuario.id, idHorario]);

    res.json({ message: "Reserva cancelada" });
  } catch (error) {
    res.status(500).json({ message: "Error al cancelar" });
  }
};

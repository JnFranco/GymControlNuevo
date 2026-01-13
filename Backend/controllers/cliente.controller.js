const db = require("../db/connection");
const ClienteModel = require('../models/cliente.model');

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

// 📌 CORRECCIÓN: Exportar el Dashboard de la misma forma
exports.getDashboardData_cli = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("1. [CONTROLLER]: Petición para ID:", id);

    const results = await ClienteModel.getDashboard(id);
    console.log("2. [CONTROLLER]: Datos recibidos del modelo");

    const data = results[0];
    let dias_restantes = 0;

    if (data && data.ultima_fecha) {
      const vencimiento = new Date(data.ultima_fecha);
      vencimiento.setDate(vencimiento.getDate() + (data.duracion || 0));
      const hoy = new Date();
      dias_restantes = Math.max(0, Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24)));
    }

    res.json({
      nombre_membresia: data?.nombre_membresia || "Sin Membresía",
      dias_restantes: dias_restantes,
      total_asistencias: data?.total_asistencias || 0,
      total_reservas: data?.total_reservas || 0
    });

    console.log("3. [CONTROLLER]: Respuesta enviada");
  } catch (error) {
    console.error("❌ [CONTROLLER ERROR]:", error.message);
    res.status(500).json({ error: error.message });
  }
};



// ✅ OBTENER CLASES PARA CLASESVIEW
exports.obtenerClases_cli = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const rows = await ClienteModel.getClases_cli(idUsuario);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener clases cliente:", error);
    res.status(500).json({ error: "Error al obtener lista de clases" });
  }
};

// ✅ RESERVAR CLASE
exports.reservarClase_cli = async (req, res) => {
  const { idHorario, idUsuario } = req.body;
  try {
    await ClienteModel.reservar_cli(idUsuario, idHorario);
    res.json({ success: true, mensaje: "Reserva exitosa" });
  } catch (error) {
    console.error("❌ Error al reservar:", error);
    res.status(500).json({ error: "Error al procesar reserva" });
  }
};

// ✅ CANCELAR RESERVA
exports.cancelarReserva_cli = async (req, res) => {
  const { idHorario, idUsuario } = req.body;
  try {
    await ClienteModel.cancelar_cli(idUsuario, idHorario);
    res.json({ success: true, mensaje: "Reserva cancelada" });
  } catch (error) {
    console.error("❌ Error al cancelar:", error);
    res.status(500).json({ error: "Error al cancelar" });
  }
};


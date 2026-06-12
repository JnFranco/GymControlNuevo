const ReservasModel = require('../models/reservas.model');

// ✅ Obtener todas las reservas
exports.getReservas = async (req, res) => {
  try {
    const reservas = await ReservasModel.obtenerReservas();
    res.json(reservas);
  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// ✅ Obtener reserva por ID
exports.getReservaById = async (req, res) => {
  try {
    const reserva = await ReservasModel.obtenerReservaPorId(req.params.id);
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reserva', error });
  }
};

// ✅ Crear nueva reserva CON VALIDACIÓN
exports.createReserva = async (req, res) => {
  try {
    const { id_usuario, id_horario } = req.body;
    if (!id_usuario || !id_horario)
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });

    const id = await ReservasModel.crearReserva(id_usuario, id_horario);
    res.status(201).json({ id, mensaje: 'Reserva creada correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// ✅ Actualizar estado de la reserva
exports.updateReserva = async (req, res) => {
  try {
    const { estado } = req.body;
    const updated = await ReservasModel.actualizarReserva(req.params.id, { estado });
    if (updated === 0) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    res.json({ mensaje: 'Estado de reserva actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar reserva', error });
  }
};

// ✅ Eliminar reserva
exports.deleteReserva = async (req, res) => {
  try {
    const deleted = await ReservasModel.eliminarReserva(req.params.id);
    if (deleted === 0) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    res.json({ mensaje: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar reserva', error });
  }
};

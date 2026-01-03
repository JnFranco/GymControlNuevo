const db = require('../db/connection'); // Ajusta según tu configuración

// ============================================
// MÉTODOS EXISTENTES (mantén los que ya tienes)
// ============================================

// ✅ Obtener horarios
exports.getHorarios = async (req, res) => {
  try {
    const horarios = await HorariosModel.obtenerHorarios();
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener horarios', error });
  }
};

// ✅ Crear horario
exports.createHorario = async (req, res) => {
  try {
    const { id_clase, dia_semana, hora_inicio, hora_fin, capacidad } = req.body;
    if (!id_clase || !dia_semana || !hora_inicio || !hora_fin)
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });

    const id = await HorariosModel.crearHorario({ id_clase, dia_semana, hora_inicio, hora_fin, capacidad });
    res.status(201).json({ id, mensaje: 'Horario creado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear horario', error });
  }
};

// ✅ Eliminar horario
exports.deleteHorario = async (req, res) => {
  try {
    const deleted = await HorariosModel.eliminarHorario(req.params.id);
    if (deleted === 0) return res.status(404).json({ mensaje: 'Horario no encontrado' });
    res.json({ mensaje: 'Horario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar horario', error });
  }
};


// exports.getHorarios = async (req, res) => {
//   // Tu código existente...
// };

// exports.createHorario = async (req, res) => {
//   // Tu código existente...
// };

// exports.deleteHorario = async (req, res) => {
//   // Tu código existente...
// };

// ============================================
// 👇 NUEVOS MÉTODOS PARA INSTRUCTOR
// ============================================

// GET - Obtener horarios de un instructor con información de reservas
exports.getHorariosByInstructor = async (req, res) => {
  try {
    const instructorId = req.params.id;
    
    console.log('🔍 Buscando horarios para instructor ID:', instructorId);
    
    const query = `
      SELECT 
        h.id,
        h.dia_semana,
        h.hora_inicio,
        h.hora_fin,
        h.capacidad,
        c.nombre AS clase_nombre,
        c.descripcion AS clase_descripcion,
        c.id AS clase_id,
        COUNT(r.id) AS reservas_count
      FROM horarios h
      INNER JOIN clases c ON h.id_clase = c.id
      LEFT JOIN reservas r ON r.id_horario = h.id AND r.estado != 'Cancelada'
      WHERE c.id_entrenador = ?
      GROUP BY h.id, h.dia_semana, h.hora_inicio, h.hora_fin, h.capacidad, c.nombre, c.descripcion, c.id
      ORDER BY 
        FIELD(h.dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
        h.hora_inicio ASC
    `;
    
    const [horarios] = await db.query(query, [instructorId]);
    
    // Calcular cupos disponibles y porcentaje de ocupación
    const horariosConCupos = horarios.map(h => ({
      ...h,
      cupos_ocupados: parseInt(h.reservas_count) || 0,
      cupos_disponibles: h.capacidad - (parseInt(h.reservas_count) || 0),
      porcentaje_ocupacion: Math.round(((parseInt(h.reservas_count) || 0) / h.capacidad) * 100)
    }));
    
    console.log(`✅ Se encontraron ${horarios.length} horarios para el instructor`);
    
    res.json(horariosConCupos);
    
  } catch (error) {
    console.error('❌ Error al obtener horarios del instructor:', error);
    res.status(500).json({ 
      error: 'Error al obtener los horarios del instructor',
      details: error.message 
    });
  }
};

// GET - Obtener reservas de un horario específico
exports.getReservasByHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;
    
    console.log('🔍 Buscando reservas para horario ID:', horarioId);
    
    const query = `
      SELECT 
        r.id,
        r.fecha_reserva,
        r.estado,
        u.nombre,
        u.apellido,
        u.correo,
        u.telefono
      FROM reservas r
      INNER JOIN usuarios u ON r.id_usuario = u.id
      WHERE r.id_horario = ?
      ORDER BY r.fecha_reserva DESC
    `;
    
    const [reservas] = await db.query(query, [horarioId]);
    
    console.log(`✅ Se encontraron ${reservas.length} reservas para el horario`);
    
    res.json(reservas);
    
  } catch (error) {
    console.error('❌ Error al obtener reservas del horario:', error);
    res.status(500).json({ 
      error: 'Error al obtener las reservas',
      details: error.message 
    });
  }
};

// const HorariosModel = require('../models/horarios.model');

// // ✅ Obtener horarios
// exports.getHorarios = async (req, res) => {
//   try {
//     const horarios = await HorariosModel.obtenerHorarios();
//     res.json(horarios);
//   } catch (error) {
//     res.status(500).json({ mensaje: 'Error al obtener horarios', error });
//   }
// };

// // ✅ Crear horario
// exports.createHorario = async (req, res) => {
//   try {
//     const { id_clase, dia_semana, hora_inicio, hora_fin, capacidad } = req.body;
//     if (!id_clase || !dia_semana || !hora_inicio || !hora_fin)
//       return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });

//     const id = await HorariosModel.crearHorario({ id_clase, dia_semana, hora_inicio, hora_fin, capacidad });
//     res.status(201).json({ id, mensaje: 'Horario creado correctamente' });
//   } catch (error) {
//     res.status(500).json({ mensaje: 'Error al crear horario', error });
//   }
// };

// // ✅ Eliminar horario
// exports.deleteHorario = async (req, res) => {
//   try {
//     const deleted = await HorariosModel.eliminarHorario(req.params.id);
//     if (deleted === 0) return res.status(404).json({ mensaje: 'Horario no encontrado' });
//     res.json({ mensaje: 'Horario eliminado correctamente' });
//   } catch (error) {
//     res.status(500).json({ mensaje: 'Error al eliminar horario', error });
//   }
// };

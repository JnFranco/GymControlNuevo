const AsistenciasModel = require('../models/asistencias.model');
const db = require('../db/connection');

// ============================================
// MÉTODOS EXISTENTES (NO TOCAR)
// ============================================

exports.getAsistencias = async (req, res) => {
  try {
    const asistencias = await AsistenciasModel.obtenerAsistencias();
    res.json(asistencias);
  } catch (error) {
    console.error('❌ Error al obtener asistencias:', error);
    res.status(500).json({ mensaje: 'Error al obtener asistencias', error });
  }
};

exports.getAsistenciaById = async (req, res) => {
  try {
    const asistencia = await AsistenciasModel.obtenerAsistenciaPorId(req.params.id);
    if (!asistencia) return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    res.json(asistencia);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener asistencia', error });
  }
};

exports.createAsistencia = async (req, res) => {
  try {
    const { id_reserva, presente } = req.body;
    if (!id_reserva) return res.status(400).json({ mensaje: 'Falta el campo id_reserva' });

    const id = await AsistenciasModel.registrarAsistencia({ id_reserva, presente });
    res.status(201).json({ id, mensaje: 'Asistencia registrada correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar asistencia:', error);
    res.status(500).json({ mensaje: 'Error al registrar asistencia', error });
  }
};

exports.updateAsistencia = async (req, res) => {
  try {
    const { presente } = req.body;
    const updated = await AsistenciasModel.actualizarAsistencia(req.params.id, { presente });
    if (updated === 0) return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    res.json({ mensaje: 'Asistencia actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar asistencia', error });
  }
};

exports.deleteAsistencia = async (req, res) => {
  try {
    const deleted = await AsistenciasModel.eliminarAsistencia(req.params.id);
    if (deleted === 0) return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    res.json({ mensaje: 'Asistencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar asistencia', error });
  }
};

// ============================================
// 👇 NUEVOS MÉTODOS PARA INSTRUCTOR
// ============================================

// GET - Obtener clases del instructor
exports.getClasesInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    console.log('🔍 Obteniendo clases del instructor:', instructorId);
    
    const query = `
      SELECT 
        id,
        nombre,
        descripcion,
        cupos
      FROM clases
      WHERE id_entrenador = ? AND activo = TRUE
      ORDER BY nombre ASC
    `;
    
    const [clases] = await db.query(query, [instructorId]);
    
    console.log(`✅ Se encontraron ${clases.length} clases`);
    
    res.json(clases);
    
  } catch (error) {
    console.error('❌ Error al obtener clases:', error);
    res.status(500).json({ 
      error: 'Error al obtener las clases',
      details: error.message 
    });
  }
};

// GET - Obtener horarios de una clase
exports.getHorariosByClase = async (req, res) => {
  try {
    const { claseId } = req.params;
    
    console.log('🔍 Obteniendo horarios de la clase:', claseId);
    
    const query = `
      SELECT 
        id,
        dia_semana,
        hora_inicio,
        hora_fin,
        capacidad
      FROM horarios
      WHERE id_clase = ?
      ORDER BY 
        FIELD(dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
        hora_inicio ASC
    `;
    
    const [horarios] = await db.query(query, [claseId]);
    
    console.log(`✅ Se encontraron ${horarios.length} horarios`);
    
    res.json(horarios);
    
  } catch (error) {
    console.error('❌ Error al obtener horarios:', error);
    res.status(500).json({ 
      error: 'Error al obtener los horarios',
      details: error.message 
    });
  }
};

// GET - Obtener reservas confirmadas de un horario con asistencias
exports.getReservasByHorario = async (req, res) => {
  try {
    const { horarioId } = req.params;
    
    console.log('🔍 Obteniendo reservas del horario:', horarioId);
    
    const query = `
      SELECT 
        r.id AS reserva_id,
        r.estado,
        r.fecha_reserva,
        u.id AS usuario_id,
        u.nombre,
        u.apellido,
        u.correo,
        u.telefono,
        COALESCE(a.presente, 0) AS presente,
        a.id AS asistencia_id
      FROM reservas r
      INNER JOIN usuarios u ON r.id_usuario = u.id
      LEFT JOIN asistencias a ON a.id_reserva = r.id AND DATE(a.fecha_asistencia) = CURDATE()
      WHERE r.id_horario = ? AND r.estado = 'Confirmada'
      ORDER BY u.nombre ASC, u.apellido ASC
    `;
    
    const [reservas] = await db.query(query, [horarioId]);
    
    console.log(`✅ Se encontraron ${reservas.length} reservas confirmadas`);
    
    res.json(reservas);
    
  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    res.status(500).json({ 
      error: 'Error al obtener las reservas',
      details: error.message 
    });
  }
};

// POST - Marcar/desmarcar asistencia
exports.marcarAsistencia = async (req, res) => {
  try {
    const { id_reserva, presente } = req.body;
    
    if (!id_reserva) {
      return res.status(400).json({ error: 'Falta el campo id_reserva' });
    }
    
    console.log('✅ Marcando asistencia:', { id_reserva, presente });
    
    // Verificar si ya existe un registro de asistencia para hoy
    const [existente] = await db.query(
      `SELECT id FROM asistencias 
       WHERE id_reserva = ? AND DATE(fecha_asistencia) = CURDATE()`,
      [id_reserva]
    );
    
    if (existente.length > 0) {
      // Actualizar registro existente
      await db.query(
        `UPDATE asistencias 
         SET presente = ? 
         WHERE id = ?`,
        [presente ? 1 : 0, existente[0].id]
      );
      
      console.log('✅ Asistencia actualizada');
    } else {
      // Crear nuevo registro
      await db.query(
        `INSERT INTO asistencias (id_reserva, presente, fecha_asistencia) 
         VALUES (?, ?, CURDATE())`,
        [id_reserva, presente ? 1 : 0]
      );
      
      console.log('✅ Asistencia creada');
    }
    
    res.json({ 
      success: true,
      message: presente ? 'Asistencia marcada' : 'Asistencia desmarcada'
    });
    
  } catch (error) {
    console.error('❌ Error al marcar asistencia:', error);
    res.status(500).json({ 
      error: 'Error al marcar la asistencia',
      details: error.message 
    });
  }
};

// const AsistenciasModel = require('../models/asistencias.model');

// // ✅ Obtener todas las asistencias
// exports.getAsistencias = async (req, res) => {
//   try {
//     const asistencias = await AsistenciasModel.obtenerAsistencias();
//     res.json(asistencias);
//   } catch (error) {
//     console.error('❌ Error al obtener asistencias:', error);
//     res.status(500).json({ mensaje: 'Error al obtener asistencias', error });
//   }
// };

// // ✅ Obtener asistencia por ID
// exports.getAsistenciaById = async (req, res) => {
//   try {
//     const asistencia = await AsistenciasModel.obtenerAsistenciaPorId(req.params.id);
//     if (!asistencia) return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
//     res.json(asistencia);
//   } catch (error) {
//     res.status(500).json({ mensaje: 'Error al obtener asistencia', error });
//   }
// };

// // ✅ Registrar nueva asistencia
// exports.createAsistencia = async (req, res) => {
//   try {
//     const { id_reserva, presente } = req.body;
//     if (!id_reserva) return res.status(400).json({ mensaje: 'Falta el campo id_reserva' });

//     const id = await AsistenciasModel.registrarAsistencia({ id_reserva, presente });
//     res.status(201).json({ id, mensaje: 'Asistencia registrada correctamente' });
//   } catch (error) {
//     console.error('❌ Error al registrar asistencia:', error);
//     res.status(500).json({ mensaje: 'Error al registrar asistencia', error });
//   }
// };

// // ✅ Actualizar asistencia (presente o no)
// exports.updateAsistencia = async (req, res) => {
//   try {
//     const { presente } = req.body;
//     const updated = await AsistenciasModel.actualizarAsistencia(req.params.id, { presente });
//     if (updated === 0) return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
//     res.json({ mensaje: 'Asistencia actualizada correctamente' });
//   } catch (error) {
//     res.status(500).json({ mensaje: 'Error al actualizar asistencia', error });
//   }
// };

// // ✅ Eliminar asistencia
// exports.deleteAsistencia = async (req, res) => {
//   try {
//     const deleted = await AsistenciasModel.eliminarAsistencia(req.params.id);
//     if (deleted === 0) return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
//     res.json({ mensaje: 'Asistencia eliminada correctamente' });
//   } catch (error) {
//     res.status(500).json({ mensaje: 'Error al eliminar asistencia', error });
//   }
// };

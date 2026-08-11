const db = require('../db/connection');
const ConfigModel = require('./config.model');

// ✅ Obtener todas las reservas con datos del usuario, clase y horario
async function obtenerReservas() {
  const [rows] = await db.query(`
    SELECT r.id, 
           u.nombre AS usuario, 
           c.nombre AS clase,
           h.dia_semana, h.hora_inicio, h.hora_fin,
           r.estado, r.fecha_reserva
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id
    JOIN horarios h ON r.id_horario = h.id
    JOIN clases c ON h.id_clase = c.id
    ORDER BY r.fecha_reserva DESC
  `);
  return rows;
}

// ✅ Obtener reserva por ID
async function obtenerReservaPorId(id) {
  const [rows] = await db.query(
    `SELECT * FROM reservas WHERE id = ?`,
    [id]
  );
  return rows[0];
}

// ✅ VALIDACIÓN: Verificar cupos disponibles de un horario
async function obtenerCuposDisponibles(idHorario) {
  const [rows] = await db.query(`
    SELECT h.capacidad, h.id_clase, c.id_entrenador,
           h.dia_semana, h.hora_inicio, h.hora_fin,
           (SELECT COUNT(*) FROM reservas r 
            WHERE r.id_horario = ? AND r.estado = 'Confirmada') AS ocupados
    FROM horarios h
    JOIN clases c ON c.id = h.id_clase
    WHERE h.id = ?
  `, [idHorario, idHorario]);

  if (rows.length === 0) return null;

  const horario = rows[0];
  return {
    capacidad: parseInt(horario.capacidad),
    ocupados: parseInt(horario.ocupados),
    disponibles: parseInt(horario.capacidad) - parseInt(horario.ocupados),
    dia_semana: horario.dia_semana,
    hora_inicio: horario.hora_inicio,
    hora_fin: horario.hora_fin,
    id_clase: horario.id_clase,
    id_entrenador: horario.id_entrenador
  };
}

// ✅ VALIDACIÓN: Verificar si ya tiene reserva activa en ese horario
async function existeReservaActiva(idUsuario, idHorario) {
  const [rows] = await db.query(
    `SELECT id FROM reservas WHERE id_usuario = ? AND id_horario = ? AND estado = 'Confirmada'`,
    [idUsuario, idHorario]
  );
  return rows.length > 0;
}

// ✅ VALIDACIÓN: Verificar cruce de reservas del usuario en el mismo día/hora
async function tieneCruceReserva(idUsuario, idHorario) {
  const [rows] = await db.query(`
    SELECT r.id
    FROM reservas r
    JOIN horarios h ON r.id_horario = h.id
    WHERE r.id_usuario = ? AND r.estado = 'Confirmada'
      AND h.dia_semana = (SELECT dia_semana FROM horarios WHERE id = ?)
      AND h.hora_inicio = (SELECT hora_inicio FROM horarios WHERE id = ?)
    LIMIT 1
  `, [idUsuario, idHorario, idHorario]);
  return rows.length > 0;
}

// ✅ VALIDACIÓN: Verificar si el horario es en el pasado
async function esHorarioPasado(idHorario) {
  const [rows] = await db.query(`
    SELECT h.dia_semana, h.hora_inicio, h.hora_fin
    FROM horarios h
    WHERE h.id = ?
  `, [idHorario]);

  if (rows.length === 0) return true;

  const horario = rows[0];
  const diasMap = {
    'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4,
    'Viernes': 5, 'Sábado': 6, 'Domingo': 0
  };

  const ahora = new Date();
  const diaActual = ahora.getDay();
  const horaActual = ahora.getHours();
  const minutoActual = ahora.getMinutes();
  const horaActualDecimal = horaActual + minutoActual / 60;

  const diaHorario = diasMap[horario.dia_semana] ?? -1;

  if (diaHorario < diaActual) return true;

  if (diaHorario === diaActual) {
    const [horaIni] = horario.hora_inicio.split(':').map(Number);
    return horaActual >= horaIni;
  }

  return false;
}

// ✅ VALIDACIÓN: Verificar si el usuario tiene membresía activa
async function tieneMembresiaActiva(idUsuario) {
  const [rows] = await db.query(`
    SELECT p.id FROM pagos p
    JOIN membresias m ON p.id_membresia = m.id
    WHERE p.id_usuario = ?
      AND p.estado = 'Pagado'
      AND DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY) >= CURDATE()
    ORDER BY p.fecha_pago DESC LIMIT 1
  `, [idUsuario]);
  return rows.length > 0;
}

// ✅ Crear una nueva reserva CON VALIDACIÓN Y TRANSACCIÓN
async function crearReserva(idUsuario, idHorario) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Verificar que el horario existe
    const cuposInfo = await obtenerCuposDisponibles.call(null, idHorario);
    if (!cuposInfo) {
      await connection.rollback();
      throw new Error('Horario no encontrado');
    }

    // 2. Validar membresía activa
    const conMembresia = await tieneMembresiaActiva(idUsuario);
    if (!conMembresia) {
      await connection.rollback();
      throw new Error('No tienes una membresía activa para reservar clases');
    }

    // 3. Validar cupos disponibles
    if (cuposInfo.disponibles <= 0) {
      await connection.rollback();
      throw new Error('No hay cupos disponibles para esta clase');
    }

    // 3.5 Validar configuración del sistema y máximo de reservas
    const config = await ConfigModel.obtenerConfig();
    if (!config.sistemaActivo) {
      await connection.rollback();
      throw new Error('El sistema está en mantenimiento temporal');
    }
    if (!config.reservasActivas) {
      await connection.rollback();
      throw new Error('Las reservas están deshabilitadas temporalmente');
    }

    const maxReservas = parseInt(config.maxReservas) || 3;
    const [countRows] = await connection.query(
      `SELECT COUNT(*) AS total FROM reservas WHERE id_usuario = ? AND estado = 'Confirmada'`,
      [idUsuario]
    );
    if (parseInt(countRows[0].total) >= maxReservas) {
      await connection.rollback();
      throw new Error(`Has alcanzado el máximo de ${maxReservas} reservas permitidas`);
    }

    // 4. Validar reserva duplicada
    const yaReservado = await existeReservaActiva(idUsuario, idHorario);
    if (yaReservado) {
      await connection.rollback();
      throw new Error('Ya tienes una reserva activa para este horario');
    }

    // 5. Validar cruce de horarios
    const cruce = await tieneCruceReserva(idUsuario, idHorario);
    if (cruce) {
      await connection.rollback();
      throw new Error('Tienes otra reserva en el mismo día y hora');
    }

    // 6. Validar que no sea horario pasado
    const esPasado = await esHorarioPasado(idHorario);
    if (esPasado) {
      await connection.rollback();
      throw new Error('No se puede reservar un horario que ya pasó');
    }

    // 7. Insertar reserva
    const [result] = await connection.query(
      `INSERT INTO reservas (id_usuario, id_horario, estado, fecha_reserva) VALUES (?, ?, 'Confirmada', NOW())`,
      [idUsuario, idHorario]
    );

    await connection.commit();
    return result.insertId;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ✅ Actualizar estado de una reserva
async function actualizarReserva(id, { estado }) {
  const [result] = await db.query(
    `UPDATE reservas SET estado = ? WHERE id = ?`,
    [estado, id]
  );
  return result.affectedRows;
}

// ✅ Eliminar reserva
async function eliminarReserva(id) {
  const [result] = await db.query(`DELETE FROM reservas WHERE id = ?`, [id]);
  return result.affectedRows;
}

// ✅ Horas que faltan hasta la próxima ocurrencia de la clase (null si no se puede calcular)
async function horasHastaClase(idHorario) {
  const [rows] = await db.query(
    `SELECT dia_semana, hora_inicio FROM horarios WHERE id = ?`,
    [idHorario]
  );
  if (rows.length === 0) return null;

  const diasMap = {
    'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4,
    'Viernes': 5, 'Sábado': 6, 'Domingo': 0
  };
  const dia = diasMap[rows[0].dia_semana];
  if (dia === undefined) return null;

  const [hh, mm] = rows[0].hora_inicio.split(':').map(Number);
  const ahora = new Date();
  const hoy = ahora.getDay();
  const horaActual = ahora.getHours() + ahora.getMinutes() / 60;
  const horaClase = (hh || 0) + (mm || 0) / 60;

  let diffDias = (dia - hoy + 7) % 7;
  if (diffDias === 0 && horaActual >= horaClase) diffDias = 7;

  const proxima = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate() + diffDias,
    hh || 0,
    mm || 0,
    0
  );

  return (proxima - ahora) / (1000 * 60 * 60);
}

// ✅ Cancelar reserva del usuario (con ventana de cancelación)
async function cancelarReserva(idUsuario, idHorario) {
  const config = await ConfigModel.obtenerConfig();
  const horasMinimas = parseInt(config.cancelarHoras) || 0;

  if (horasMinimas > 0) {
    const horas = await horasHastaClase(idHorario);
    if (horas !== null && horas < horasMinimas) {
      throw new Error(
        `Solo puedes cancelar con al menos ${horasMinimas} hora(s) de anticipación`
      );
    }
  }

  const [result] = await db.query(
    `UPDATE reservas SET estado = 'Cancelada' WHERE id_usuario = ? AND id_horario = ? AND estado = 'Confirmada'`,
    [idUsuario, idHorario]
  );
  return result.affectedRows;
}

module.exports = {
  obtenerReservas,
  obtenerReservaPorId,
  obtenerCuposDisponibles,
  existeReservaActiva,
  tieneCruceReserva,
  esHorarioPasado,
  tieneMembresiaActiva,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
  cancelarReserva
};
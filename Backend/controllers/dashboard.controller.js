const db = require('../db/connection');

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAY_ORDER = { 'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6 };

// ✅ Estadísticas del instructor
async function getStatsInstructor(req, res) {
  try {
    const { id } = req.params;

    const [clasesActivas] = await db.query(
      `SELECT COUNT(*) AS total FROM clases WHERE id_entrenador = ? AND activo = 1`,
      [id]
    );

    const [horariosAsignados] = await db.query(
      `SELECT COUNT(*) AS total
       FROM horarios h
       JOIN clases c ON h.id_clase = c.id
       WHERE c.id_entrenador = ?`,
      [id]
    );

    const diaActual = DIAS[new Date().getDay()];
    const [reservasDelDia] = await db.query(
      `SELECT COUNT(*) AS total
       FROM reservas r
       JOIN horarios h ON r.id_horario = h.id
       JOIN clases c ON h.id_clase = c.id
       WHERE c.id_entrenador = ? AND r.estado = 'Confirmada' AND h.dia_semana = ?`,
      [id, diaActual]
    );

    const [asistencia] = await db.query(
      `SELECT COUNT(a.id) AS total, SUM(a.presente) AS presentes
       FROM asistencias a
       JOIN reservas r ON a.id_reserva = r.id
       JOIN horarios h ON r.id_horario = h.id
       JOIN clases c ON h.id_clase = c.id
       WHERE c.id_entrenador = ?`,
      [id]
    );

    const total = Number(asistencia[0].total) || 0;
    const presentes = Number(asistencia[0].presentes) || 0;
    const asistenciaPromedio = total > 0 ? Math.round((presentes / total) * 100) : 0;

    res.json({
      clasesActivas: Number(clasesActivas[0].total),
      horariosAsignados: Number(horariosAsignados[0].total),
      reservasDelDia: Number(reservasDelDia[0].total),
      asistenciaPromedio
    });
  } catch (error) {
    console.error('❌ Error en getStatsInstructor:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del instructor' });
  }
}

// ✅ Próxima clase del instructor
async function getProximaClase(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT
        c.nombre AS clase,
        h.dia_semana,
        TIME_FORMAT(h.hora_inicio, '%H:%i') AS hora_inicio,
        h.id AS horario_id,
        CONCAT(u.nombre, ' ', u.apellido) AS instructor
       FROM horarios h
       JOIN clases c ON h.id_clase = c.id
       JOIN usuarios u ON u.id = c.id_entrenador
       WHERE c.id_entrenador = ? AND c.activo = 1
       ORDER BY FIELD(h.dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'), h.hora_inicio`,
      [id]
    );

    const ahora = new Date();
    const diaActualIdx = ahora.getDay();
    const horaActualMin = ahora.getHours() * 60 + ahora.getMinutes();

    let proxima = null;
    for (const row of rows) {
      const diaIdx = DAY_ORDER[row.dia_semana];
      const [h, m] = row.hora_inicio.split(':').map(Number);
      const minutos = h * 60 + m;
      const diffDias = (diaIdx - diaActualIdx + 7) % 7;
      if (diffDias === 0 && minutos <= horaActualMin) continue;

      if (
        proxima === null ||
        diffDias < proxima.diffDias ||
        (diffDias === proxima.diffDias && minutos < proxima.minutos)
      ) {
        proxima = { ...row, diffDias, minutos };
      }
    }

    if (!proxima) {
      return res.json({ proxima: null });
    }

    res.json({
      proxima: {
        nombre: proxima.clase,
        hora: `${proxima.dia_semana}, ${proxima.hora_inicio}`,
        instructor: proxima.instructor,
        horario_id: proxima.horario_id
      }
    });
  } catch (error) {
    console.error('❌ Error en getProximaClase:', error);
    res.status(500).json({ error: 'Error al obtener la próxima clase' });
  }
}

module.exports = { getStatsInstructor, getProximaClase };

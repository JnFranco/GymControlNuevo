const db = require("../db/connection");

exports.reporteAsistencias = async (req, res) => {
    try {
        const { inicio, fin } = req.query;

        const [rows] = await db.query(`
        SELECT 
            DATE(a.fecha_asistencia) AS fecha,
            c.nombre AS clase,
            CONCAT(u.nombre, ' ', u.apellido) AS entrenador,
            COUNT(*) AS total_asistentes
        FROM asistencias a
        INNER JOIN reservas r ON r.id = a.id_reserva
        INNER JOIN horarios h ON h.id = r.id_horario
        INNER JOIN clases c ON c.id = h.id_clase
        INNER JOIN usuarios u ON u.id = c.id_entrenador
        WHERE a.presente = 1
            AND a.fecha_asistencia BETWEEN ? AND ?
        GROUP BY fecha, clase, entrenador
        ORDER BY fecha ASC
        `, [inicio, fin]);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const db = require('../db/connection');
const ReservasModel = require('../models/reservas.model');

exports.getMisReservas = async (req, res) => {
    try {
        const correo = req.query.correo;
        if (!correo) return res.status(400).json({ error: "Falta el correo" });

        const [rows] = await db.execute(
        `SELECT 
            r.id,
            c.nombre AS clase,
            h.dia_semana AS fecha,
            h.hora_inicio,
            h.hora_fin,
            r.estado
        FROM reservas r
        JOIN usuarios u ON u.id = r.id_usuario
        JOIN horarios h ON h.id = r.id_horario
        JOIN clases c ON c.id = h.id_clase
        WHERE u.correo = ?
        ORDER BY r.fecha_reserva DESC`,
        [correo]
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Crear mi reserva real (del usuario logueado) CON VALIDACIÓN
exports.createMiReserva = async (req, res) => {
    try {
        const correo = req.user.correo;
        const { id_horario } = req.body;

        if (!id_horario) return res.status(400).json({ error: "Falta id_horario" });

        // Obtener id del usuario
        const [userRows] = await db.execute("SELECT id FROM usuarios WHERE correo = ?", [correo]);
        if (userRows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const idUsuario = userRows[0].id;
        const id = await ReservasModel.crearReserva(idUsuario, id_horario);
        res.json({ id, mensaje: "Reserva creada con éxito" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar mi reserva real (del usuario logueado)
exports.deleteMiReserva = async (req, res) => {
    try {
        const correo = req.user.correo;
        const { id } = req.params;
        const [result] = await db.execute(`DELETE FROM reservas WHERE id = ? AND id_usuario = (SELECT id FROM usuarios WHERE correo = ?)`, [id, correo]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva no encontrada' });
        res.json({ mensaje: "Reserva eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
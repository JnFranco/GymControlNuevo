const db = require('../db/connection');
const ClasesModel = require('../models/clases.model');

exports.getMisClases = async (req, res) => {
    try {
        const correo = req.query.correo;
        if (!correo) return res.status(400).json({ error: "Falta el parámetro 'correo'" });

        const [rows] = await db.execute(
        `SELECT c.id,
                c.nombre,
                c.descripcion,
                c.cupos,
                c.activo,
                u.nombre AS instructor,
                h.dia_semana,
                h.hora_inicio,
                h.hora_fin
        FROM clases c
        JOIN horarios h ON c.id = h.id_clase
        JOIN usuarios u ON c.id_entrenador = u.id
        WHERE u.correo = ? AND c.activo = 1
        ORDER BY h.dia_semana, h.hora_inicio`,
        [correo]
        );

        res.json(rows);
    } catch (error) {
        console.error("❌ Error en getMisClases:", error);
        res.status(500).json({ error: error.message });
    }
};


// Crear mi clase real (del usuario logueado) CON VALIDACIÓN
exports.createMiClase = async (req, res) => {
    try {
        const correo = req.user.correo;
        const { nombre, descripcion, cupos, dia_semana, hora_inicio, hora_fin } = req.body;

        if (!nombre || !dia_semana || !hora_inicio || !hora_fin) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const cuposNum = parseInt(cupos) || 10;
        if (cuposNum <= 0) {
            return res.status(400).json({ error: "La capacidad debe ser mayor a 0" });
        }

        // Obtener id del instructor
        const [userRows] = await db.execute("SELECT id FROM usuarios WHERE correo = ?", [correo]);
        if (userRows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const idEntrenador = userRows[0].id;

        // Validar cruce de horario
        const cruce = await ClasesModel.existeCruceHorario({
            id_entrenador: idEntrenador,
            dia_semana,
            hora_inicio,
            hora_fin
        });

        if (cruce) {
            return res.status(409).json({
                error: `Conflicto de horario: ya tienes la clase "${cruce.nombre_clase}" el ${cruce.dia_semana} de ${cruce.hora_inicio.slice(0,5)} a ${cruce.hora_fin.slice(0,5)}`
            });
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                `INSERT INTO clases (nombre, descripcion, cupos, id_entrenador, activo) VALUES (?, ?, ?, (SELECT id FROM usuarios WHERE correo = ?), 1)`,
                [nombre, descripcion, cuposNum, correo]
            );

            await connection.execute(
                `INSERT INTO horarios (id_clase, dia_semana, hora_inicio, hora_fin, capacidad) VALUES (?, ?, ?, ?, ?)`,
                [result.insertId, dia_semana, hora_inicio, hora_fin, cuposNum]
            );

            await connection.commit();
            res.json({ id: result.insertId, mensaje: "Clase creada con éxito" });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar mi clase real (del usuario logueado)
exports.deleteMiClase = async (req, res) => {
    try {
        const correo = req.user.correo;
        const { id } = req.params;
        const [result] = await db.execute(`DELETE FROM clases WHERE id = ? AND id_entrenador = (SELECT id FROM usuarios WHERE correo = ?)`, [id, correo]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Clase no encontrada' });
        res.json({ mensaje: "Clase eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
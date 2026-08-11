const db = require("../db/connection");

exports.getMembresias = async (req, res) => {
    try {
        const [rows] = await db.query(
        "SELECT id, nombre, descripcion, costo, duracion_dias FROM membresias ORDER BY costo ASC"
        );
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al obtener membresías:", error);
        res.status(500).json({ error: "Error al obtener membresías" });
    }
};

exports.createMembresia = async (req, res) => {
    try {
        const { nombre, descripcion, costo, duracion_dias } = req.body;

        if (!nombre || costo == null || !duracion_dias) {
            return res.status(400).json({ mensaje: "nombre, costo y duracion_dias son requeridos" });
        }

        const [result] = await db.query(
            "INSERT INTO membresias (nombre, descripcion, costo, duracion_dias) VALUES (?, ?, ?, ?)",
            [nombre, descripcion || null, costo, duracion_dias]
        );

        res.status(201).json({ id: result.insertId, mensaje: "Membresía creada correctamente" });
    } catch (error) {
        console.error("❌ Error al crear membresía:", error);
        res.status(500).json({ error: "Error al crear membresía" });
    }
};

exports.updateMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, costo, duracion_dias } = req.body;

        if (!nombre || costo == null || !duracion_dias) {
            return res.status(400).json({ mensaje: "nombre, costo y duracion_dias son requeridos" });
        }

        const [result] = await db.query(
            "UPDATE membresias SET nombre = ?, descripcion = ?, costo = ?, duracion_dias = ? WHERE id = ?",
            [nombre, descripcion || null, costo, duracion_dias, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Membresía no encontrada" });
        }

        res.json({ mensaje: "Membresía actualizada correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar membresía:", error);
        res.status(500).json({ error: "Error al actualizar membresía" });
    }
};

exports.deleteMembresia = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query("DELETE FROM membresias WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Membresía no encontrada" });
        }

        res.json({ mensaje: "Membresía eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar membresía:", error);
        res.status(500).json({ error: "No se pudo eliminar la membresía (puede tener pagos asociados)" });
    }
};

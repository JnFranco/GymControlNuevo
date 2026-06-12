const db = require("../db/connection");

exports.getMembresias = async (req, res) => {
    try {
        const [rows] = await db.query(
        "SELECT id, nombre, descripcion, costo, duracion_dias FROM membresias"
        );
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al obtener membresías:", error);
        res.status(500).json({ error: "Error al obtener membresías" });
    }
};

exports.deleteMembresia = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la membresía tiene pagos asociados
        const [pagos] = await db.query(
            "SELECT COUNT(*) AS total FROM pagos WHERE id_membresia = ?",
            [id]
        );

        if (pagos[0].total > 0) {
            return res.status(409).json({
                mensaje: "No se puede eliminar la membresía porque tiene pagos asociados"
            });
        }

        // Verificar si la membresía existe
        const [existe] = await db.query(
            "SELECT id FROM membresias WHERE id = ?",
            [id]
        );

        if (existe.length === 0) {
            return res.status(404).json({ mensaje: "Membresía no encontrada" });
        }

        // Eliminar membresía
        await db.query("DELETE FROM membresias WHERE id = ?", [id]);

        res.json({ mensaje: "Membresía eliminada exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar membresía:", error);
        res.status(500).json({ error: "Error al eliminar membresía" });
    }
};

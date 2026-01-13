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

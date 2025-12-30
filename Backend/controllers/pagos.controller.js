const db = require('../db/connection');

exports.getPagosPendientes = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        p.fecha_pago AS fecha,
        p.monto
      FROM pagos p
      JOIN usuarios u ON u.id = p.id_usuario
      WHERE p.estado = 'Pendiente'
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cobrarPago = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `UPDATE pagos SET estado = 'Pagado' WHERE id = ?`,
      [id]
    );

    res.json({ message: `Pago ${id} cobrado correctamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

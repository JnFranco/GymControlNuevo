const db = require("../db/connection");

exports.getPagosPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        p.estado,
        p.monto,
        p.metodo_pago,
        m.nombre AS membresia,
        m.duracion_dias
      FROM pagos p
      INNER JOIN membresias m ON p.id_membresia = m.id
      WHERE p.id_usuario = ?
      ORDER BY p.id DESC
    `, [id]);

    // SIEMPRE responder array
    res.json(rows);
  } catch (error) {
    console.error("❌ Error pagos:", error);
    res.status(500).json([]);
  }
};


exports.pagarMembresia = async (req, res) => {
  try {
    const { id } = req.params;
    const { metodo_pago } = req.body;

    if (!metodo_pago) {
      return res.status(400).json({ mensaje: "Método de pago requerido" });
    }

    // Simulación de pago
    const estado = metodo_pago === "Efectivo" ? "Pendiente" : "Pagado";

    // Código solo para efectivo
    const codigo = metodo_pago === "Efectivo"
      ? "EF-" + Math.floor(100000 + Math.random() * 900000)
      : null;

    await db.query(
      `UPDATE pagos 
        SET metodo_pago = ?, estado = ?, fecha_pago = CURRENT_DATE
        WHERE id = ?`,
      [metodo_pago, estado, id]
    );

    res.json({
      mensaje: "Pago procesado correctamente",
      estado,
      codigo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al procesar el pago" });
  }
};


exports.getPagosPendientes = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        m.nombre AS membresia,
        p.monto,
        DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY) AS proximo_pago,
        DATEDIFF(
          DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY),
          CURDATE()
        ) AS dias_restantes
      FROM pagos p
      JOIN usuarios u ON u.id = p.id_usuario
      JOIN membresias m ON m.id = p.id_membresia
      WHERE p.estado != 'Pagado'
        AND DATEDIFF(
          DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY),
          CURDATE()
        ) >= 0
      ORDER BY proximo_pago ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cobrarPago = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("➡️ Intentando cobrar pago:", id);

    const [result] = await db.execute(
      `UPDATE pagos SET estado = 'Pagado' WHERE id = ?`,
      [id]
    );

    console.log("✅ Resultado SQL:", result);

    res.status(200).json({
      ok: true,
      message: `Pago ${id} cobrado correctamente`
    });

  } catch (error) {
    console.error("❌ ERROR EN COBRAR PAGO:", error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};




exports.getPagosPendientesAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        m.nombre AS membresia,
        p.monto,
        DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY) AS proximo_pago,
        DATEDIFF(
          DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY),
          CURDATE()
        ) AS dias_restantes
      FROM pagos p
      JOIN usuarios u ON u.id = p.id_usuario
      JOIN membresias m ON m.id = p.id_membresia
      WHERE p.estado != 'Pagado'
        AND DATEDIFF(
          DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY),
          CURDATE()
        ) >= 0
      ORDER BY proximo_pago ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPagosAtrasadosAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        m.nombre AS membresia,
        p.monto,
        DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY) AS fecha_vencimiento,
        DATEDIFF(
          CURDATE(),
          DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY)
        ) AS dias_atraso
      FROM pagos p
      JOIN usuarios u ON u.id = p.id_usuario
      JOIN membresias m ON m.id = p.id_membresia
      WHERE p.estado != 'Pagado'
        AND DATEDIFF(
          CURDATE(),
          DATE_ADD(p.fecha_pago, INTERVAL m.duracion_dias DAY)
        ) > 0
      ORDER BY dias_atraso DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crearPago = async (req, res) => {
  const { id_usuario, id_membresia } = req.body;

  try {
    const [[membresia]] = await db.execute(
      "SELECT costo FROM membresias WHERE id = ?",
      [id_membresia]
    );

    await db.execute(`
      INSERT INTO pagos (id_usuario, id_membresia, monto, estado)
      VALUES (?, ?, ?, 'Pendiente')
    `, [id_usuario, id_membresia, membresia.costo]);

    res.json({ message: "Pago creado" });
  } catch (error) {
    console.error("❌ Error crear pago:", error);
    res.status(500).json({ error: "No se pudo crear el pago" });
  }
};


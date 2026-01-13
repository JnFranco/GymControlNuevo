

const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagos.controller');

// 🧪 TEST
router.get('/test', (req, res) => {
  res.json({ ok: true });
});

// ✅ ADMIN PAGOS
router.get('/pendientes', pagosController.getPagosPendientes);
router.get('/atrasados', pagosController.getPagosAtrasadosAdmin);
router.post('/cobrar/:id', pagosController.cobrarPago);
router.post("/:id/pagar",pagosController.pagarMembresia);



module.exports = router;

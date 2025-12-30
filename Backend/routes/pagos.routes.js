const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagos.controller');

router.get('/pagos/pendientes', pagosController.getPagosPendientes);
router.post('/pagos/cobrar/:id', pagosController.cobrarPago);

module.exports = router;

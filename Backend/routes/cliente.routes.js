const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/cliente.controller");

// Fíjate bien en los nombres después del punto:
router.get('/dashboard/:id', clienteController.getDashboardData_cli);
router.get("/clases", clienteController.obtenerClases_cli); 
router.post("/reservar", clienteController.reservarClase_cli);
router.put("/cancelar/:idHorario", clienteController.cancelarReserva_cli);

module.exports = router;
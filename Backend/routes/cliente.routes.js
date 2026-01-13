const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/cliente.controller");

// DASHBOARD
router.get('/dashboard/:id', clienteController.getDashboardData_cli);

// CLASES (Añadimos :idUsuario para filtrar sus reservas)
router.get("/clases/:idUsuario", clienteController.obtenerClases_cli); 

// RESERVAR (Recibe idUsuario e idHorario por el body)
router.post("/reservar", clienteController.reservarClase_cli);

// CANCELAR (Cambiado a POST para enviar los datos de forma segura)
router.post("/cancelar", clienteController.cancelarReserva_cli);

module.exports = router;


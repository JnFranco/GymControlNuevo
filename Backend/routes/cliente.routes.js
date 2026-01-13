const express = require("express");
const router = express.Router();
const controller = require("../controllers/cliente.controller");
const auth = require("../middlewares/auth"); // tu middleware JWT

router.get("/clases", auth, controller.obtenerClasesDisponibles);
router.post("/reservar", auth, controller.reservarClase);
router.put("/cancelar/:idHorario", auth, controller.cancelarReserva);

module.exports = router;

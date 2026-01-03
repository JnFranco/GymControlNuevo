const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horarios.controller');

// Rutas existentes (admin)
router.get('/', horariosController.getHorarios);
router.post('/', horariosController.createHorario);
router.delete('/:id', horariosController.deleteHorario);

// 👇 NUEVAS RUTAS PARA INSTRUCTOR
router.get('/instructor/:id', horariosController.getHorariosByInstructor);
router.get('/:horarioId/reservas', horariosController.getReservasByHorario);

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const horariosController = require('../controllers/horarios.controller');

// router.get('/', horariosController.getHorarios);
// router.post('/', horariosController.createHorario);
// router.delete('/:id', horariosController.deleteHorario);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const reservasController = require('../controllers/reservas.controller');
router.use(authMiddleware);

router.get('/', reservasController.getReservas);
router.get('/:id', reservasController.getReservaById);
router.post('/', reservasController.createReserva);
router.put('/:id', reservasController.updateReserva);
router.delete('/:id', reservasController.deleteReserva);

module.exports = router;
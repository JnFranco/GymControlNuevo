const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/admin/stats', adminController.getResumen);
router.get('/admin/estadisticas', adminController.getEstadisticas);
router.get('/admin/asistencias-semana', adminController.getEstadisticas);


module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

/* router.get('/admin/stats', adminController.getResumen);
router.get('/admin/estadisticas', adminController.getEstadisticas);
router.get('/admin/asistencias-semana', adminController.getEstadisticas);
*/ 

const {
    reporteUsuarios,
    reporteEntrenadores,
    reporteClases,
    reporteMembresias
} = require("../controllers/admin.reportes.controller");


router.get('/stats', adminController.getResumen);
router.get('/estadisticas', adminController.getEstadisticas);
router.get('/asistencias-semana', adminController.getEstadisticas);

router.get("/reportes/usuarios", reporteUsuarios);
router.get("/reportes/entrenadores", reporteEntrenadores);
router.get("/reportes/clases", reporteClases);
router.get("/reportes/membresias", reporteMembresias);


module.exports = router;

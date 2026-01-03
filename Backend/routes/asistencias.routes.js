const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/asistencias.controller');

// ============================================
// TEST
// ============================================
router.get('/test', (req, res) => {
  res.send('✅ Ruta de asistencias funcionando');
});

// ============================================
// 👇 RUTAS ESPECÍFICAS (PRIMERO)
// ============================================

// Clases del instructor
router.get(
  '/instructor/:instructorId/clases',
  asistenciasController.getClasesInstructor
);

// Horarios de una clase
router.get(
  '/clase/:claseId/horarios',
  asistenciasController.getHorariosByClase
);

// Reservas de un horario
router.get(
  '/horario/:horarioId/reservas',
  asistenciasController.getReservasByHorario
);

// Marcar asistencia
router.post(
  '/marcar',
  asistenciasController.marcarAsistencia
);

// ============================================
// 👇 RUTAS GENÉRICAS (AL FINAL)
// ============================================

router.get('/', asistenciasController.getAsistencias);
router.get('/:id', asistenciasController.getAsistenciaById);
router.post('/', asistenciasController.createAsistencia);
router.put('/:id', asistenciasController.updateAsistencia);
router.delete('/:id', asistenciasController.deleteAsistencia);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const asistenciasController = require('../controllers/asistencias.controller');

// router.get('/test', (req, res) => {
//   res.send('✅ Ruta de asistencias funcionando');
// });

// // ============================================
// // RUTAS EXISTENTES (NO TOCAR)
// // ============================================
// router.get('/', asistenciasController.getAsistencias);
// router.get('/:id', asistenciasController.getAsistenciaById);
// router.post('/', asistenciasController.createAsistencia);
// router.put('/:id', asistenciasController.updateAsistencia);
// router.delete('/:id', asistenciasController.deleteAsistencia);

// // ============================================
// // 👇 NUEVAS RUTAS PARA INSTRUCTOR
// // ============================================

// // Obtener clases del instructor para el selector
// router.get('/instructor/:instructorId/clases', asistenciasController.getClasesInstructor);

// // Obtener horarios de una clase específica
// router.get('/clase/:claseId/horarios', asistenciasController.getHorariosByClase);

// // Obtener reservas confirmadas de un horario
// router.get('/horario/:horarioId/reservas', asistenciasController.getReservasByHorario);

// // Marcar/desmarcar asistencia
// router.post('/marcar', asistenciasController.marcarAsistencia);

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const asistenciasController = require('../controllers/asistencias.controller');

// router.get('/test', (req, res) => {
//   res.send('✅ Ruta de asistencias funcionando');
// });


// router.get('/', asistenciasController.getAsistencias);
// router.get('/:id', asistenciasController.getAsistenciaById);
// router.post('/', asistenciasController.createAsistencia);
// router.put('/:id', asistenciasController.updateAsistencia);
// router.delete('/:id', asistenciasController.deleteAsistencia);

// module.exports = router;

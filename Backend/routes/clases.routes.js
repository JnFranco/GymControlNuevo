const express = require("express");
const router = express.Router();

const {
  getClases,
  getClaseById,
  createClase,
  updateClase,
  deleteClase,
  getClasesPorInstructor
} = require("../controllers/clases.controller");

// ==============================
// RUTAS CLASES (USANDO CONTROLLER)
// ==============================

// Obtener todas las clases (admin)
router.get("/", getClases);

// Obtener clase por ID
router.get("/:id", getClaseById);

// Crear clase + horario
router.post("/", createClase);

// Actualizar clase + horario
router.put("/:id", updateClase);

// Eliminar clase
router.delete("/:id", deleteClase);

// Obtener clases por instructor
router.get("/instructor/:id_entrenador", getClasesPorInstructor);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const clasesController = require('../controllers/clases.controller');


// router.get('/instructor/:id_entrenador', clasesController.getClasesPorInstructor);

// // router.get('/mis-clases', authMiddleware, clasesController.getMisClases);
// // router.get('/', clasesController.getClases);
// // router.get('/:id', clasesController.getClaseById);
// // router.post('/', clasesController.createClase);
// // router.put('/:id', clasesController.updateClase);
// // router.delete('/:id', clasesController.deleteClase);

// router.get('/', clasesController.getClases);
// router.get('/:id', clasesController.getClaseById);
// router.get('/instructor/:id_entrenador', clasesController.getClasesPorInstructor); // ⬅️ NUEVA RUTA
// router.post('/', clasesController.createClase);
// router.put('/:id', clasesController.updateClase);
// router.delete('/:id', clasesController.deleteClase);

module.exports = router;
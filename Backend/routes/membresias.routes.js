const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middleware/auth");

const {
    getMembresias,
    deleteMembresia
} = require("../controllers/membresias.controller");

router.get("/", authMiddleware, getMembresias);
router.delete("/:id", authMiddleware, roleMiddleware('Administrador'), deleteMembresia);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
    getMembresias,
    createMembresia,
    updateMembresia,
    deleteMembresia
} = require("../controllers/membresias.controller");

router.get("/", getMembresias);
router.post("/", createMembresia);
router.put("/:id", updateMembresia);
router.delete("/:id", deleteMembresia);

module.exports = router;

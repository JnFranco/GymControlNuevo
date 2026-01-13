const express = require("express");
const router = express.Router();
const { getMiMembresia } = require("../controllers/mi-membresia.controller");

router.get("/mi-membresia", getMiMembresia);

module.exports = router;

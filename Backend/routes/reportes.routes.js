const express = require("express");
const router = express.Router();
const { reporteAsistencias } = require("../controllers/reportes.controller");

router.get("/asistencias", reporteAsistencias);

module.exports = router;

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

router.get("/dashboard/instructor/:id", dashboardController.getStatsInstructor);
router.get("/dashboard/instructor/:id/proxima-clase", dashboardController.getProximaClase);

module.exports = router;

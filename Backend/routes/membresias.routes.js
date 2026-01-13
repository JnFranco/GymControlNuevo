const express = require("express");
const router = express.Router();

const {
    getMembresias
} = require("../controllers/membresias.controller");

router.get("/", getMembresias);

module.exports = router;

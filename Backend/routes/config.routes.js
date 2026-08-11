const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');

router.get('/', configController.getConfig);
router.put('/', configController.updateConfig);

module.exports = router;

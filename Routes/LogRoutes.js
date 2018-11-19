const express = require('express');
const router = express.Router();
const LogController = require('../Controllers/LogController');

router.get('/', LogController.logs);

module.exports = router;
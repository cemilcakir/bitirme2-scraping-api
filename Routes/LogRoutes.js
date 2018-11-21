const express = require('express');
const router = express.Router();
const LogController = require('../Controllers/LogController');

router.get('/', LogController.logs);
router.get('/search', LogController.search);

module.exports = router;
const express = require('express');
const router = express.Router();
const LogController = require('../Controllers/LogController');

router.get('/', LogController.logs_by_ip);
router.get('/search', LogController.search);
router.get('/city/:city', LogController.logs_by_city);
router.get('/all', LogController.logs_all);

module.exports = router;
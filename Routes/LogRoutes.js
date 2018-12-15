const express = require('express');
const router = express.Router();
const LogController = require('../Controllers/LogController');

router.get('/', LogController.logs_by_ip);
router.get('/search', LogController.search);
router.get('/all', LogController.logs_all);
router.get('/cities', LogController.get_all_cities);
router.get('/cities/:city', LogController.logs_by_city);

module.exports = router;
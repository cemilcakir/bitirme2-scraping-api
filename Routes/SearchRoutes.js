const express = require('express');
const router = express.Router();
const SearchController = require('../Controllers/SearchController');

router.get('/', SearchController.search);
router.get('/detail', SearchController.getDetails);

module.exports = router;
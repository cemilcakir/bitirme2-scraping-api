const express = require('express');
const router = express.Router();
const auth = require('../Middleware/Auth');
const SiteController = require('../Controllers/SiteController');

router.get('/', auth, SiteController.search);

module.exports = router;
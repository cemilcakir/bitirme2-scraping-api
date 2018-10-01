const express = require('express');
const router = express.Router();
const auth = require('../Middleware/Auth');
const SiteController = require('../Controllers/SiteController');

router.get('/', auth, SiteController.sites);
router.post('/', auth, SiteController.add);
router.delete('/:siteId', auth, SiteController.delete);

module.exports = router;
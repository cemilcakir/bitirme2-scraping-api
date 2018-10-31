const express = require('express');
const router = express.Router();
const auth = require('../Middleware/Auth');
const DetailController = require('../Controllers/DetailController');

router.get('/', auth, DetailController.details);
router.post('/', auth, DetailController.add);
router.delete('/:id', auth, DetailController.delete);
router.patch('/:id', auth, DetailController.patch)

module.exports = router;
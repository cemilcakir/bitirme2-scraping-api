const express = require('express');
const router = express.Router();
const auth = require('../Middleware/Auth');
const AuthController = require('../Controllers/AuthController');

router.post('/login', AuthController.login);
router.post('/signup', auth, AuthController.signup);

module.exports = router;
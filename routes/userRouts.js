const express = require('express');
const authController = require('../contorller/authConterller');
const { signupValidation, loginValidation } = require('../middlewares/authValidation');
const router = express.Router();


router.post('/signup',signupValidation, authController.signup);
router.post('/login',loginValidation, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
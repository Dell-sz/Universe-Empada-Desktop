const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authModel = require('../models/auth.model');

router.post('/login', authController.login);
router.post('/logout', authModel.authenticate.bind(authModel), authController.logout);
router.get('/me', authModel.authenticate.bind(authModel), authController.me);
router.get('/permissao/:recurso/:acao', authModel.authenticate.bind(authModel), authController.verificarPermissao);

module.exports = router;


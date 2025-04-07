import express from 'express';
import { login, registro } from '../controllers/authController.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { check } from 'express-validator';
const router = express.Router();

// Ruta para registrar usuarios

router.post('/registro', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener un minimo de 6 caracteres').isLength({ min: 6}),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], registro);

// Ruta para iniciar sesion

router.post('/login', [
    validarCampos
], login);

export default router;
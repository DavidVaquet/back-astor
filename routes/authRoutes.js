import express from 'express';
import { login, registro, resetPassword, solicitarResetPassword } from '../controllers/authController.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { check } from 'express-validator';
import { verificarResetToken } from '../middlewares/validar-resetToken.js';
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


router.post('/solicitar-reset-password', [
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], solicitarResetPassword);


router.put('/restablecer-password/:token', verificarResetToken, resetPassword);

export default router;
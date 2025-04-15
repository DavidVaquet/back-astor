import express from 'express';
import { verificarToken } from '../middlewares/validar-token.js';
import { obtenerUsuarios, editarUsuario } from '../controllers/userController.js';
import { validarRol } from '../middlewares/validar-rol.js';

const router = express.Router();

router.get('/getUsuarios', verificarToken, obtenerUsuarios);

router.put('/editarUsuario/:id', verificarToken, validarRol(['ADMIN_ROLE']), editarUsuario);

export default router;
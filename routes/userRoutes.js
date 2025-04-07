import express from 'express';
import { verificarToken } from '../middlewares/validar-token.js';
import { obtenerUsuarios, editarUsuario } from '../controllers/userController.js';

const router = express.Router();

router.get('/getUsuarios', verificarToken, obtenerUsuarios);

router.put('/editarUsuario/:id', verificarToken, editarUsuario);

export default router;
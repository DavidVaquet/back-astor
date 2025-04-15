import express from 'express';
import { editarHistorialGeneral, editarHistorialMensual, guardarHistorialConsolidado, guardarHistorialYReiniciar, obtenerHistorialesPorLocal, obtenerHistorialGeneral} from '../controllers/historialController.js';
import { verificarToken } from '../middlewares/validar-token.js';
import { validarRol } from '../middlewares/validar-rol.js';

const router = express.Router();

router.post('/guardar-historial', verificarToken, guardarHistorialYReiniciar);
router.get('/obtener-historial/:local', verificarToken, obtenerHistorialesPorLocal)
router.get('/obtener-historialgeneral', verificarToken, obtenerHistorialGeneral);
router.post('/guardar-historial-consolidado', verificarToken, guardarHistorialConsolidado);
router.put('/editar-historial-general/:id', verificarToken, validarRol(['ADMIN_ROLE']), editarHistorialGeneral);
router.put('/editar-historial-mensual/:id', verificarToken, validarRol(['ADMIN_ROLE']), editarHistorialMensual);

export default router; 
import express from 'express';
import { verificarToken } from '../middlewares/validar-token.js';
import { crearTransferenciaCompartida, editarTransferencia, obtenerTransferenciasCompartidas, eliminarTransferencia } from '../controllers/transferenciaController.js';

const router = express.Router();

router.post('/crearTransferencia', verificarToken, crearTransferenciaCompartida);
router.get('/obtenerTransferencias', verificarToken, obtenerTransferenciasCompartidas);
router.put('/editarTransferencia/:id', verificarToken, editarTransferencia);
router.delete('/eliminarTransferencia/:id', verificarToken, eliminarTransferencia);

export default router;
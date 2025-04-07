import express from 'express';
import { crearTransaccion, obtenerComprobantesPorLocal, obtenerTotalGeneral, obtenerTotalesPorLocal, eliminarComprobante, editarComprobante, obtenerCantidadComprobantesPorMes } from '../controllers/transaccionController.js';
import { verificarToken } from '../middlewares/validar-token.js';
import { validarRolPorLocal } from '../middlewares/validar-local.js';
const router = express.Router();

// Ruta para crear una transaccion
router.post('/crearTransaccion', verificarToken, validarRolPorLocal, crearTransaccion);

// Ruta para obtener una transaccion
router.get('/listarComprobantes/:local', verificarToken, obtenerComprobantesPorLocal);

// Ruta para obtener totales por local y generales
router.get('/obtenerTotalesGenerales', verificarToken, obtenerTotalGeneral);
router.get('/totalPorLocal/:local', verificarToken, obtenerTotalesPorLocal);

// Ruta para obtener los datos del gráfico circular por local y mes
router.get("/totalesMensuales/:local/:anio", verificarToken, obtenerCantidadComprobantesPorMes);

// Ruta para eliminar un comprobante
router.delete('/eliminarComprobante/:id', verificarToken, eliminarComprobante);

// Ruta para editar un comprobante
router.put('/editarComprobante/:id', verificarToken, editarComprobante);

export default router;
import express from 'express';
import { estadisticasSemanales } from '../jobs/historialJobs.js';
import { verificarToken } from '../middlewares/validar-token.js';
import { editarEstadisticasSemanales, getEstadisticasSemanales, eliminarEstadistica } from '../controllers/historialSemanalController.js';

const router = express.Router();

// Ruta temporal de prueba
router.get('/test-estadisticas-semanales', async (req, res) => {
  try {
    await estadisticasSemanales();
    res.status(200).json({ msg: '✅ Estadísticas semanales generadas correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: '❌ Error al generar estadísticas semanales.' });
  }
});

router.get('/semanales', verificarToken, getEstadisticasSemanales);
router.put('/editar-estadistica/:id', verificarToken, editarEstadisticasSemanales);
router.delete('/eliminar-estadistica/:id', verificarToken, eliminarEstadistica);

export default router;
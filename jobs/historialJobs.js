import cron from 'node-cron';
import { guardarHistorialYReiniciar, guardarHistorialConsolidado } from '../controllers/historialController.js';
import calcularEstadisticasSemanales from '../controllers/historialSemanalController.js';

export const iniciarHistorialJob = () => {
  // Ejecutar todos los días a las 23:58
  cron.schedule('58 23 * * *', async () => {
    const ahora = new Date();
    const mañana = new Date(ahora);
    mañana.setDate(ahora.getDate() + 1);

    // Si mañana es 1 => hoy es el último día del mes
    if (mañana.getDate() === 1) {
      console.log('📆 Ejecutando job de historial mensual (último día del mes a las 23:58)');
      try {
        await guardarHistorialYReiniciar({}, {
          status: () => ({ json: console.log }),
          json: console.log
        });
        await guardarHistorialConsolidado({}, {
          status: () => ({ json: console.log }),
          json: console.log
        });
      } catch (error) {
        console.error('❌ Error al ejecutar el cron job mensual:', error.message);
      }
    }
  });
};

export const estadisticasSemanales = () => {
  // Ejecutar todos los lunes a las 14:00 PM
  cron.schedule('0 14 * * 1', calcularEstadisticasSemanales);
};


// TEST JOB / SE EJECUTA CADA 1 MIN
// export const estadisticasSemanales = () => {
//   cron.schedule('* * * * *', calcularEstadisticasSemanales);
// };
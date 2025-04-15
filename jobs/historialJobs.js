import cron from 'node-cron';
import { guardarHistorialYReiniciar, guardarHistorialConsolidado } from '../controllers/historialController.js';

export const iniciarHistorialJob = () => {

    cron.schedule('0 0 1 * *', async () => {
        console.log('Ejecutando job de historial mensual')
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
            console.error('❌ Error al ejecutar el cron job:', error.message);
        }
    })
};

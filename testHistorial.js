import { guardarHistorialYReiniciar } from './controllers/historialController.js';
import dotenv from 'dotenv';
import { conectarDB } from './database/config.js';

dotenv.config();

const test = async () => {
  await conectarDB();

  console.log('🧪 Ejecutando prueba de historial mensual...');

  try {
    await guardarHistorialYReiniciar({}, {
      status: (code) => ({
        json: (data) => console.log(`✅ Status ${code}:`, data)
      }),
      json: (data) => console.log('✅ Respuesta:', data)
    });

    console.log('🎉 Prueba completada.');
    process.exit(0); // Salir correctamente
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    process.exit(1); // Salir con error
  }
};

test();

import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { conectarDB } from "./database/config.js";

import authRoutes from './routes/authRoutes.js';
import transaccionRoutes from './routes/transaccionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import historialRoutes from './routes/historialRoutes.js';
import transferenciasRoutes from './routes/transferenciasRoutes.js';
import { estadisticasSemanales, iniciarHistorialJob } from "./jobs/historialJobs.js";
import estadisticasSemanalesRoutes from './routes/estadisticasSemanalesRoutes.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// Body parser
app.use(express.json());


// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/transferencias', transferenciasRoutes);
app.use('/api/estadisticas', estadisticasSemanalesRoutes);
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error('UNCAUGHT ERROR:', err);
  res.status(err.status || 500).json({ ok: false, error: err.message });
});

async function start() {
  try {
    await conectarDB();
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
    });

    iniciarHistorialJob();
    estadisticasSemanales();

  } catch (err) {
    console.error('Error al iniciar la app:', err);
    process.exit(1);
  }
}

start();
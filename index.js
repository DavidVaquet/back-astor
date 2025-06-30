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

const PORT = process.env.PORT || 5002;
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://astor-front.vercel.app'
];

// ✅ Middleware CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para el origin: ${origin}`);
      callback(new Error('No autorizado por CORS'));
    }
  },
  credentials: true,
};

// ✅ Aplica CORS primero
app.use(cors(corsOptions));

// ✅ Preflight manual para todas las rutas
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());

// Conexión a la base de datos
conectarDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/transferencias', transferenciasRoutes);
app.use('/api/estadisticas', estadisticasSemanalesRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Cron jobs
iniciarHistorialJob();
estadisticasSemanales();
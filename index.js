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

if (process.env.NODE_ENV === "development") {
  const allowedOrigins = [
    "http://localhost:5173",        
    "https://astor-front.vercel.app" 
  ];

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS bloqueado para el origin: ${origin}`);
        callback(new Error("No autorizado por CORS"));
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  console.log("✅ CORS habilitado en modo DEV:", allowedOrigins);
} else {
  // Producción (frontend y backend en mismo dominio)
  // No es necesario habilitar CORS
  console.log("🚀 Producción: CORS no habilitado (same-origin).");
}

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
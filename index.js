import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import { conectarDB} from "./database/config.js";
import authRoutes from './routes/authRoutes.js';
import transaccionRoutes from './routes/transaccionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import historialRoutes from './routes/historialRoutes.js';
import { iniciarHistorialJob } from "./jobs/historialJobs.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

// Middlewares

app.use(express.json());
app.use(cors());

// Conexion a la base de datos

conectarDB();

// Rutas

app.use('/api/auth', authRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/historial', historialRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
});


iniciarHistorialJob();
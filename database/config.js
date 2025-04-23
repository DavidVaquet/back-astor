import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const conectarDB = async() => {


    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Base de datos online')

    } catch (error) {
        console.error('Error en la conexion de la base de datos', error)
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}
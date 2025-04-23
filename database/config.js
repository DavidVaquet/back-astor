import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const conectarDB = async() => {

    console.log("🔍 MONGODB ENV VARIABLE:", process.env.MONGODB_URI);

    try {
        await mongoose.connect('mongodb+srv://user_node:asd123@miclusterapp.cvukv.mongodb.net/astorDB');
        console.log('Base de datos online')

    } catch (error) {
        console.error('Error en la conexion de la base de datos', error)
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}
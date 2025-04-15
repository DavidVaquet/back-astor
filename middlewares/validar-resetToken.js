import jwt from 'jsonwebtoken';
import {request, response} from 'express';



export const verificarResetToken = async(req = request, res = response, next) => {

    const { token } = req.params;
    
    if (!token) {
        res.status(400).json({error: 'Token de recuperación no proporcionado'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        
        next();

    } catch (error) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
    }


}
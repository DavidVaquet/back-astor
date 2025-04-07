import { request, response } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req = request, res = response, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      error: 'Acceso denegado, el token es requerido',
    });
  }

  try {
    const tokenLimpio = token.replace('Bearer ', '').trim();
    const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

    req.user = {
      id: verificado.id,
      roles: verificado.roles,
    };

    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Token invalido',
    });
  }
};

// middlewares/validar-rol.js
import { request, response } from "express";

export const validarRol = (rolesPermitidos) => {
  return (req = request, res = response, next) => {
    if (!req.user?.roles || !req.user.roles.some(rol => rolesPermitidos.includes(rol))) {
      return res.status(403).json({
        error: "Acceso denegado - el rol es incorrecto",
      });
    }

    next();
  };
};

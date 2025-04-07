import { request, response } from "express"



export const validarRol = (rolesPermitidos) => {

return (req = request, res = response, next) => {

if (!rolesPermitidos.includes(req.user.roles)) {

    return res.status(403).json({
        error: 'Acceso denegado - el rol es incorrecto'
    })    
}

next();

}
};
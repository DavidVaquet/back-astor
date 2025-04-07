
export const validarRolPorLocal = (req, res, next) => {

    const rolesUsuario = req.user.roles;
    const local = req.body.local;

    const permisosPorLocal = {
        astorFray: ['ADMIN_ROLE', 'ENCARGADOFRAY_ROLE'],
        astorGalindez: ['ADMIN_ROLE', 'ENCARGADOGALINDEZ_ROLE'],
        inmobiliaria: ['ADMIN_ROLE', 'ENCARGADOINMOBILIARIA_ROLE']
    };

    if(!permisosPorLocal[local]) {
        res.status(400).json({
            msg: `El local ${local} no es valido`
        })
    };

    const rolesPermitidos = permisosPorLocal[local];


    const tienePermiso = rolesUsuario.some(rol => rolesPermitidos.includes(rol));

    if (!tienePermiso) {
        res.status(403).json({
            msg: `No tienes permisos para subir comprobantes a este local`
        })
    }

    next();
}
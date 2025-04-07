import User from "../models/User"

export const verificarEstadoUsuario = async(req, res, next) =>{

    try {
     
      const usuario = await User.findById(req.user.id);

      if (!usuario) {
        return res.status(404).json({
            msg: 'El usuario no existe'
        })
      };
      
      if (!usuario.estado) {
        return res.status(400).json({
            msg: 'Tu cuenta esta desactivada. Acceso denegado'
        })
      };

      next();
      
    } catch (error) {
      return res.status(500).json({
        msg: 'Error al verificar el estado del usuario',
        error: error.message,
      })
    }


}
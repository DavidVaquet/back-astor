import User from "../models/User.js";
import bcrypt from 'bcryptjs';

export const obtenerUsuarios = async(req, res) => {

    try {
      
       const usuarios = await User.find({}, 'nombre email roles estado');
       
       res.json(usuarios);

    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los usuarios',
            error: error.message,
        })
  }};


export const editarUsuario = async (req, res) => {

    const { id } = req.params;
    const { nombre, email, password, roles, estado } = req.body;
    
    try {
       const usuario = await User.findById(id);
       
       if (!usuario) {
        return res.status(404).json({
            msg: 'El usuario no fue encontrado'
        })
       };

       if (nombre) usuario.nombre = nombre;
       if (email) usuario.email = email;
       if (roles) usuario.roles = roles;
       if (typeof estado === 'boolean') usuario.estado = estado;

       if (password) {
        const salt = await bcrypt.genSalt(10);
       usuario.password = await bcrypt.hash(password, salt);
    }

       await usuario.save();

    res.json({ msg: 'Usuario actualizado correctamente', usuario });

    } catch (error) {
        
    }

}
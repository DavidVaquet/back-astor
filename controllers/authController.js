import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { request, response } from 'express';

export const registro = async(req = request, res = response) => {

try {
    
    const {nombre, password, email, roles} = req.body;

    const userExistente = await User.findOne({email});

    // Verificamos si el usuario existe
    if(userExistente) {
        return res.status(400).json({
            msg: 'El email ya esta en uso'
        })
    };


    // Encriptamos el password
    const passwordHash = await bcrypt.hash(password, 10);
    // Crear usuario
    const nuevoUsuario = new User({nombre, email, roles, password:passwordHash});
    // Save usuario en DB
    await nuevoUsuario.save();
    // Generamos un token para el nuevo usuario
    const token = jwt.sign({
        id: nuevoUsuario._id,
        roles: nuevoUsuario.roles
    }, process.env.JWT_SECRET );

    res.status(201).json({
        msg: 'Usuario creado con exito',
        token,
        roles: nuevoUsuario.roles,
        usuarioId: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre
    })

} catch (error) {
    
    res.status(500).json({
        msg: error.message
    })
};

}

export const login = async(req, res) => {

    try {

        const {email, password} = req.body;

        // Verificamos si el usuario existe en la DB
        const usuario = await User.findOne({ email });

        if(!usuario) {
            return res.status(400).json({
                msg: 'Credenciales incorrectas - Usuario no encontrado'
            })
        };

        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Tu cuenta está desactivada. Comunícate con un administrador."
            })
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {

            return res.status(400).json({
                msg: 'Credenciales incorrectas - Password incorrecto'
            })
        }

        // Creamos un jsonwebtoken
        const token = jwt.sign({
            id: usuario._id,
            roles: usuario.roles
        }, process.env.JWT_SECRET,
        { expiresIn: '6h'})

        res.json({ 
            token,
            roles: usuario.roles,
            usuarioId: usuario._id,
            nombre: usuario.nombre
            
        });
        
    } catch (error) {
        
        res.status(500).json({ error: error.message});
    }

}

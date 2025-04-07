import {Schema, model} from 'mongoose';


const userSchema =  new Schema({
    
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    roles: {
        type: [String],
        required: [true, 'El rol es obligatorio'],
        enum: ['ADMIN_ROLE', 'USER_ROLE', 'ENCARGADOFRAY_ROLE', 'ENCARGADOGALINDEZ_ROLE', 'ENCARGADOINMOBILIARIA_ROLE']
    },
    estado: {
        type: Boolean,
        required: [true, 'El estado es obligatorio'],
        default: true
    },


});

export default model('User', userSchema);
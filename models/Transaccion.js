import { Schema, model } from 'mongoose';


const transaccionSchema = new Schema({

    tipo: {
        type: String,
        enum: ['ingreso', 'egreso'],
        required: true
    },
    tipoComprobante: {
        type: String,
        enum: ['factura', 'ticket', 'recibo', 'transferencia'],
        required: true,
    },
    monto: {
        type: Number,
        required: true
    },
    nroComprobante: {
        type: String,
        required: true
    },
    imagenComprobante: {
        type: String,
        required: true
    },
    local: {
        type: String,
        enum: ['astorFray', 'astorGalindez', 'inmobiliaria'],
        required: true
    },
    metodoPago: {
        type: String,
        enum: ['transferencia', 'efectivo', 'tarjeta', 'debito'],
        required: true
    },
    descripcion: {
        type: String,
        required: false
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
});

export default model('Transaccion', transaccionSchema);
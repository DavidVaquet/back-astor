import { Schema, model } from 'mongoose';


const transaccionSchema = new Schema({

    tipo: {
        type: String,
        enum: ['ingreso', 'egreso'],
        required: true
    },
    tipoComprobante: {
        type: String,
        enum: ['factura', 'ticket', 'recibo', 'transferencia', 'qr'],
        required: true,
    },
    monto: {
        type: Number,
        required: true
    },
    montoAlquiler: {
        type: Number,
        required: false
    },
    porcentaje: {
        type: Number,
        required: false
    },
    nroComprobante: {
        type: String,
        required: false,
    },
    imagenComprobante: {
        type: String,
        required: false
    },
    local: {
        type: String,
        enum: ['astorFray', 'astorGalindez', 'inmobiliaria'],
        required: true
    },
    metodoPago: {
        type: String,
        enum: ['transferencia', 'efectivo', 'tarjeta', 'debito', 'qr', 'combinada'],
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
    cuenta: {
        type: String,
        enum: ["BNA+", "Mercadopago", "Naranja X"],
        default: null,
        set: (v) => (v === "" || v === "null" || v == null ? null : v)
    }, 
    archivado: {
        type: Boolean,
        default: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
});

export default model('Transaccion', transaccionSchema);
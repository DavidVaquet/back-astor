import mongoose from "mongoose";

const transferenciaCompartidaSchema = new mongoose.Schema({
    origen: {
        type: String,
        required: true,
        enum: ['Galindez', 'Fray', 'Inmobiliaria']
    },
    destino: {
        type: String,
        required: true,
        enum: ['Galindez', 'Fray', 'Inmobiliaria']
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    monto: {
        type: Number,
        required: true
    },
    detalle: {
        type: String
    },
    cuenta: {
        type: String,
        enum: ['Yanina', 'Sebastian']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export default mongoose.model('TransferenciaCompartida', transferenciaCompartidaSchema);
import mongoose from "mongoose";

const historialConsolidadoSchema = new mongoose.Schema({
    anio: {type: Number, required: true},
    mes: {type: Number, required: true},
    totalIngreso: {type: Number, required: true},
    totalEgreso: {type: Number, required: true},
    balance: {type: Number, required: true}
}, {
    timestamps: true,
    collection: 'historialConsolidado'
});


export default mongoose.model('HistorialConsolidado', historialConsolidadoSchema);
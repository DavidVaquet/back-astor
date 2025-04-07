import mongoose from 'mongoose';

const historialMensualSchema = new mongoose.Schema({
  local: {
    type: String,
    required: true,
  },
  anio: {
    type: Number,
    required: true,
  },
  mes: {
    type: Number,
    required: true,
  },
  totalIngreso: {
    type: Number,
    default: 0,
  },
  totalEgreso: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const HistorialMensual = mongoose.model('HistorialMensual', historialMensualSchema);

export default HistorialMensual;

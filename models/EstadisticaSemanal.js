import mongoose from 'mongoose';

const estadisticaSemanalSchema = new mongoose.Schema({
  semana: String,
  local: {
    type: String,
    enum: ['astorFray', 'astorGalindez', 'inmobiliaria', 'Global'],
    required: true
  },
  ingresos: Number,
  egresos: Number,
  totalAlquiler: Number,
  balance: Number,
  fechaInicio: Date,  // domingo
  fechaFin: Date,     // sábado
  mes: Number,        // 1 al 12
  anio: Number,
  global: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('EstadisticaSemanal', estadisticaSemanalSchema);
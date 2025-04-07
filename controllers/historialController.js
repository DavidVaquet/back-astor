import Transaccion from '../models/Transaccion.js';
import HistorialMensual from '../models/HistorialMensual.js';

export const guardarHistorialYReiniciar = async (req, res) => {
  try {
    const locales = ['astorFray', 'astorGalindez', 'inmobiliaria'];
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth(); 

    for (const local of locales) {
      const inicioMes = new Date(anio, mesActual, 1);
      const finMes = new Date(anio, mesActual + 1, 0, 23, 59, 59);

      const transacciones = await Transaccion.find({
        local,
        fecha: { $gte: inicioMes, $lte: finMes },
      });

      const totalIngreso = transacciones
        .filter((t) => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0);

      const totalEgreso = transacciones
        .filter((t) => t.tipo === 'egreso')
        .reduce((sum, t) => sum + t.monto, 0);

      const balance = totalIngreso - totalEgreso;

      
      const historialExistente = await HistorialMensual.findOne({ local, anio, mes: mesActual + 1 });
      if (!historialExistente) {
        await HistorialMensual.create({
          local,
          anio,
          mes: mesActual + 1,
          totalIngreso,
          totalEgreso,
          balance,
        });
      }
    }

    res.status(200).json({ msg: 'Historial mensual guardado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al guardar historial mensual', error: error.message });
  }
};

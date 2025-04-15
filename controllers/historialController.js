import Transaccion from '../models/Transaccion.js';
import HistorialMensual from '../models/HistorialMensual.js';
import HistorialConsolidado from '../models/HistorialConsolidado.js';



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


export const obtenerHistorialesPorLocal = async (req, res) => {

  try {
    const {local} = req.params;

    const historiales = await HistorialMensual.find({local}).sort({anio: -1, mes: -1});
    return res.status(200).json(historiales);

  } catch (error) {
    res.status(500).json({
      msg: 'Error al obtener los historiales', error: error.message
    })  
  }
};



export const guardarHistorialConsolidado = async (req, res) => {
  try {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();

    const inicioMes = new Date(anio, mes, 1);
    const finMes = new Date(anio, mes + 1, 0, 23, 59, 59);

    const transacciones = await Transaccion.find({
      fecha: { $gte: inicioMes, $lte: finMes }
    });

    const totalIngresos = transacciones
      .filter((t) => t.tipo === "ingreso")
      .reduce((acc, t) => acc + t.monto, 0);

    const totalEgresos = transacciones
      .filter((t) => t.tipo === "egreso")
      .reduce((acc, t) => acc + t.monto, 0);

    const balance = totalIngresos - totalEgresos;

    const historialExistente = await HistorialConsolidado.findOne({
      anio,
      mes: mes + 1
    });

    if (!historialExistente) {
      await HistorialConsolidado.create({
        anio,
        mes: mes + 1,
        totalIngreso: totalIngresos,
        totalEgreso: totalEgresos,
        balance
      });
    }

    if (res) {
      return res.status(200).json({
        msg: "Historial consolidado guardado exitosamente"
      });
    }

    console.log("Historial consolidado guardado exitosamente");
    
  } catch (error) {
    console.error("❌ Error al guardar historial consolidado:", error.message);
    if (res) {
      return res.status(500).json({
        msg: "Error al guardar historial consolidado",
        error: error.message
      });
    }
  }
};


export const obtenerHistorialGeneral = async (req, res) => {

  try {
    
    const historiales = await HistorialConsolidado.find().sort({anio: -1, mes: -1});

    return res.status(200).json(historiales);

  } catch (error) {
    
    throw new Error(error.message || 'Error al obtener el historial consolidado');
  }
};


export const editarHistorialGeneral = async (req, res) => {

  try {
    const { id } = req.params;
    const valoresActualiazdos = req.body;

    const historialActualizando = await HistorialConsolidado.findByIdAndUpdate(id, valoresActualiazdos, {new: true});

    if (!historialActualizando) {
      return res.status(404).json({ msg: 'Historial no encontrado' });
    }

    res.status(200).json({
      msg: 'Historial editado correctamente',
      historial: historialActualizando
    })

  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar el historial general',
      error: error.message,
    })
  }
};


export const editarHistorialMensual = async (req,res) => {

  try {
    const { id } = req.params;
    const valoresActualizados = req.body;

    const historialActualizado = await HistorialMensual.findByIdAndUpdate(id, valoresActualizados, {new: true});

    if (!historialActualizado){
      return res.status(404).json({ msg: 'Historial no encontrado' });
    }

    res.status(200).json({
      msg: 'Historial actualizado correctamente',
      historial: historialActualizado,
    });

  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar el historial mensual',
      error: error.message,
    })
  }


}
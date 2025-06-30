import EstadisticaSemanal from '../models/EstadisticaSemanal.js';
import Transaccion from '../models/Transaccion.js';

// Función para obtener el rango de la semana actual (lunes a lunes)
function obtenerSemanaAnterior() {
  const hoy = new Date(); // Por ejemplo, lunes 07/07/2025
  hoy.setUTCHours(0, 0, 0, 0);

  // Ir al lunes anterior (hace 7 días)
  const inicio = new Date(hoy);
  inicio.setDate(hoy.getDate() - 7);

  // Ir al domingo anterior (ayer, es decir, hace 1 día)
  const fin = new Date(hoy);
  fin.setDate(hoy.getDate());
  fin.setUTCHours(13, 59, 0, 0);

  return { inicio, fin };
}

// Función para obtener la semana del año (por ejemplo, 2025-S3)
function obtenerEtiquetaSemana(fecha) {
  const año = fecha.getFullYear();
  const inicioAnio = new Date(año, 0, 1);
  const dias = Math.floor((fecha - inicioAnio) / (1000 * 60 * 60 * 24));
  const semana = Math.ceil((dias + inicioAnio.getDay() + 1) / 7);
  return `${año}-S${semana}`;
}

export const calcularEstadisticasSemanales = async () => {
  try {
    const { inicio, fin } = obtenerSemanaAnterior();
    const semana = obtenerEtiquetaSemana(inicio);
    const anio = inicio.getFullYear();
    const mes = inicio.getMonth() + 1;
    const locales = ['astorFray', 'astorGalindez', 'inmobiliaria'];

    let ingresosGlobal = 0;
    let egresosGlobal = 0;

    for (const local of locales) {
      const transacciones = await Transaccion.find({
        local,
        fecha: { $gte: inicio, $lt: fin },
      });
      console.log(`📊 ${local} - Transacciones encontradas:`, transacciones.length);
      console.log(`🕒 Rango de fechas: ${inicio.toISOString()} a ${fin.toISOString()}`);
      console.log(`📦 Transacciones de ${local}:`, transacciones);

      const ingresos = transacciones.filter(t => t.tipo === 'ingreso');
      const egresos = transacciones.filter(t => t.tipo === 'egreso');

      const totalIngreso = ingresos.reduce((sum, t) => sum + t.monto, 0);
      const totalEgreso = egresos.reduce((sum, t) => sum + t.monto, 0);
      const balance = totalIngreso - totalEgreso;

      
      let totalAlquiler1 = 0;
      if (local === 'inmobiliaria') {
        const transaccionesConAlquiler = transacciones.filter(t => typeof t.montoAlquiler === 'number');
        totalAlquiler1 = transaccionesConAlquiler.reduce((sum, t) => sum + t.montoAlquiler, 0);
      }

      ingresosGlobal += totalIngreso;
      egresosGlobal += totalEgreso;

      const yaExiste = await EstadisticaSemanal.findOne({ local, fechaInicio: inicio });
      if (!yaExiste) {
        await EstadisticaSemanal.create({
          local,
          semana,
          anio,
          mes,
          fechaInicio: inicio,
          fechaFin: new Date(fin.getTime() - 1),
          ingresos: totalIngreso,
          egresos: totalEgreso,
          balance,
          totalAlquiler: local === 'inmobiliaria' ? totalAlquiler1 : 0,
        });
        console.log(`✅ Estadística creada para ${local}`);
      } else {
        console.log(`⏭️ Ya existe para ${local}`);
      }
    }

    const yaExisteGlobal = await EstadisticaSemanal.findOne({ local: 'Global', fechaInicio: inicio });
    if (!yaExisteGlobal) {
      await EstadisticaSemanal.create({
        local: 'Global',
        semana,
        anio,
        mes,
        fechaInicio: inicio,
        fechaFin: new Date(fin.getTime() - 1),
        ingresos: ingresosGlobal,
        egresos: egresosGlobal,
        balance: ingresosGlobal - egresosGlobal,
        totalAlquiler: 0,
        global: true,
      });
      console.log('✅ Estadística semanal GLOBAL creada');
    } else {
      console.log('⏭️ Ya existe estadística GLOBAL para esa semana');
    }

    // Reinicio de valores
    // await EstadisticaSemanal.updateMany(
    //   { semana },
    //   { $set: { ingresos: 0, egresos: 0, balance: 0, totalAlquiler: 0 } }
    // );
    // console.log('♻️ Estadísticas semanales reiniciadas a 0');

  } catch (error) {
    console.error('❌ Error al calcular estadísticas semanales:', error);
  }
};



export const getEstadisticasSemanales = async (req, res) => {
  try {
    const { local, mes, anio } = req.query;

    const filtro = {};
    
    // Si se especifica local
    if (local) filtro.local = local;

    // Si se especifica mes y año
    if (mes && anio) {
      // Convierte mes y año a números
      const mesNum = parseInt(mes);
      const anioNum = parseInt(anio);

      // Fecha desde el primer día del mes hasta el último
      const inicio = new Date(anioNum, mesNum - 1, 1);
      const fin = new Date(anioNum, mesNum, 0, 23, 59, 59, 999);

      filtro.fechaInicio = { $gte: inicio, $lte: fin };
    }

    
    const estadisticas = await EstadisticaSemanal.find(filtro);
    console.log(estadisticas);
    res.status(200).json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas semanales:', error);
    res.status(500).json({ msg: 'Error al obtener estadísticas semanales' });
  }
};

export const editarEstadisticasSemanales = async (req, res) => {

  try {
    const { id } = req.params;
    const nuevosValores = req.body;

    const estadisticasActualizadas = await EstadisticaSemanal.findByIdAndUpdate(id, nuevosValores, {new: true});
    if (!estadisticasActualizadas) return res.status(400).json({ msg: 'Error al editar las estadisticas.'});
    
    return res.status(200).json({
      msg: 'Estadistica editada correctamente.',
      estadisticasActualizadas
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error al editar las estadisticas.'})
  }
};

export const eliminarEstadistica = async (req, res) => {

  try {
    const { id } = req.params;

    const estadistica = await EstadisticaSemanal.findByIdAndDelete(id);
    if (!estadistica) return res.status(400).json({ msg: 'No se encontro la estadistica a eliminar.'});

    return res.status(200).json({
      msg: 'Estadistica eliminada correctamente.',
      estadistica
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error al eliminar la estadistica.' })
  }
}

export default calcularEstadisticasSemanales;
import Transaccion from "../models/Transaccion.js";
import { request, response } from 'express';


export const crearTransaccion = async(req = request, res = response) => {
    try {
      const {
        tipo,
        tipoComprobante,
        monto,
        nroComprobante,
        imagenComprobante,
        local,
        descripcion,
        metodoPago
      } = req.body;
  
      // Validaciones
      if (!["ingreso", "egreso"].includes(tipo)) {
        return res.status(400).json({ msg: "Tipo inválido" });
      }
  
      if (!["factura", "ticket", "recibo", "transferencia"].includes(tipoComprobante)) {
        return res.status(400).json({ msg: "Tipo de comprobante inválido" });
      }
  
      if (!["efectivo", "transferencia", "tarjeta", "debito"].includes(metodoPago)) {
        return res.status(400).json({ msg: "Método de pago inválido" });
      }
  
      if (!local) {
        return res.status(400).json({ msg: "Falta el local" });
      }
  
      if (!req.user?.id) {
        return res.status(400).json({ msg: "Usuario no autenticado" });
      }
  
      if (!monto || isNaN(monto) || monto <= 0) {
        return res.status(400).json({ msg: "Monto inválido" });
      }
  
      // Crear y guardar transacción
      const transaccion = new Transaccion({ ...req.body, usuario: req.user.id });
      await transaccion.save();
  
      res.status(201).json(transaccion);
  
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  };
  


  export const obtenerComprobantesPorLocal = async (req = request, res = response) => {
    try {
      const { local } = req.params; 
  
      
      const comprobantes = await Transaccion.find({ local}).populate('usuario', 'nombre');
  
      res.json(comprobantes);
  
    } catch (error) {
      console.error('Error al obtener los comprobantes:', error);
      res.status(500).json({
        error: 'Error al obtener los comprobantes'
      });
    }
  };
  
  
  export const obtenerTotalesPorLocal = async(req = request, res = response) => {
    try {
      const { local } = req.params;
  
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);
  
      const ingresos = await Transaccion.aggregate([
        { $match: { local, tipo: 'ingreso', fecha: { $gte: inicioMes, $lte: finMes } } },
        { $group: { _id: null, total: { $sum: '$monto' } } }
      ]);
  
      const egresos = await Transaccion.aggregate([
        { $match: { local, tipo: 'egreso', fecha: { $gte: inicioMes, $lte: finMes } } },
        { $group: { _id: null, total: { $sum: '$monto' } } }
      ]);
  
      const totalIngresos = ingresos[0]?.total || 0;
      const totalEgresos = egresos[0]?.total || 0;
      const balance = totalIngresos - totalEgresos;
  
      res.json({
        ingreso: totalIngresos,
        egreso: totalEgresos,
        balance,
      });
  
    } catch (error) {
      res.status(500).json({
        msg: 'Error al obtener los totales',
        error: error.message
      });
    }
  };
  


  export const obtenerTotalGeneral = async(req, res) => {
    try {
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);
  
      const resultado = await Transaccion.aggregate([
        {
          $match: {
            fecha: { $gte: inicioMes, $lte: finMes }
          }
        },
        {
          $group: {
            _id: '$tipo',
            total: { $sum: '$monto' }
          }
        }
      ]);
  
      const totales = {
        ingreso: 0,
        egreso: 0,
        balance: 0
      };
  
      resultado.forEach(item => {
        if (item._id === 'ingreso') totales.ingreso = item.total;
        if (item._id === 'egreso') totales.egreso = item.total;
      });
  
      totales.balance = totales.ingreso - totales.egreso;
  
      res.json(totales);
  
    } catch (error) {
      res.status(500).json({
        msg: 'Error al obtener los totales generales',
        error: error.message
      });
    }
  };
  


  export const eliminarComprobante = async(req, res) => {

    try {
      const { id } = req.params;
      await Transaccion.findByIdAndDelete(id);
      
      return res.json({ msg: 'El comprobante fue eliminado correctamente' });

    } catch (error) {
      
      res.status(500).json({
        msg: 'Error al eliminar el comprobante', error: error.message
      })
    }
  };


  export const editarComprobante = async(req, res) => {

      const { id } = req.params;
      const datosActualizados = req.body;

      try {

      const comprobante = await Transaccion.findByIdAndUpdate(id, datosActualizados, {new: true});
      
      if (!comprobante) {
        return res.status(400).json({ msg: 'Comprobante no encontrado' })
      };

      res.json({ msg: 'Comprobante actualizado correctamente', comprobante});

    } catch (error) {
      
      res.status(500).json({
        msg: 'Error al actualizar el comprobante',
        error: error.message
      })
    }
  };



export const obtenerCantidadComprobantesPorMes = async (req, res) => {
  const { local, anio } = req.params;

  try {
    const inicioAnio = new Date(`${anio}-01-01T00:00:00Z`);
    const finAnio = new Date(`${anio}-12-31T23:59:59Z`);

    const resultados = await Transaccion.aggregate([
      {
        $match: {
          local,
          fecha: { $gte: inicioAnio, $lte: finAnio }
        }
      },
      {
        $group: {
          _id: { $month: "$fecha" },
          cantidad: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Estructura de salida: un array con 12 posiciones (una por cada mes)
    const cantidadesPorMes = Array(12).fill(0); // inicializamos con ceros

    resultados.forEach(r => {
      cantidadesPorMes[r._id - 1] = r.cantidad;
    });

    res.json(cantidadesPorMes);

  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener la cantidad de comprobantes por mes', error: error.message });
  }
};

import TransferenciaCompartida from "../models/TransferenciaCompartida.js";

export const crearTransferenciaCompartida = async (req, res) => {
    try {
        const { origen, destino, monto, detalle, cuenta } = req.body;
        
        if (!origen || !destino || isNaN(monto) || monto <= 0 || !cuenta) {
            return res.status(400).json({ msg: 'Los siguientes datos son obligatorios: origen, destino, monto, cuenta.'})
        }

        const nuevaTransferencia = new TransferenciaCompartida({origen, destino, monto, detalle, cuenta, usuario: req.user.id});
        await nuevaTransferencia.save();
        
        res.status(200).json(nuevaTransferencia);
    } catch (error) {
        res.status(400).json({msg: 'Error al crear una nueva transferencia', error: error.message})

    }
}


export const obtenerTransferenciasCompartidas = async (req, res) => {
    try {
        const transferencias = await TransferenciaCompartida.find()
        .populate('usuario', 'nombre')
        .sort({fecha: -1});
        if (!transferencias) return res.status(400).json({ msg: 'Error al obtener las transferencias.'});
        return res.status(200).json(transferencias);
    } catch (error) {
        return res.status(500).json({ msg: 'Error al obtener las transferencias.'});
    }
};

export const editarTransferencia = async(req, res) => {

    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const transferencia = await TransferenciaCompartida.findByIdAndUpdate(id, datosActualizados, {new: true});
        if (!transferencia) {
            return res.status(400).json({ msg: 'Error al editar la transferencia.'})
        }
        res.status(200).json({
            msg: 'Transferencia editada correctamente.',
            transferencia
        });
    } catch (error) {
        console.error(error); // 👈 Agrega esto para ver el error real
        return res.status(500).json({ msg: 'Error al editar la transferencia.'});
    }
};


export const eliminarTransferencia = async(req, res) => {

    const { id } = req.params;

    try {
        const transferenciaEliminada = await TransferenciaCompartida.findByIdAndDelete(id);
        if (!transferenciaEliminada) {
            return res.status(400).json({ msg: 'Error al eliminar la transferencia.'})
        }
        res.status(200).json({
            msg: 'Transferencia eliminada correctamente.',
            transferenciaEliminada
        })    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al eliminar la transferencia.'});
    }
}
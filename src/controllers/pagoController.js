const { Pago, Orden } = require('../models');
const { sequelize, Op  } = require('../models');
const logger = require('../utils/logger');

const registrarPago = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { orden_id, monto, metodo_pago, referencia, observaciones } = req.body;

        // Obtener la orden
        const orden = await Orden.findByPk(orden_id, { transaction });
        
        if (!orden) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        // Crear el pago
        const pago = await Pago.create({
            orden_id,
            monto,
            metodo_pago,
            referencia,
            observaciones,
            usuario_registro_id: req.usuario.id
        }, { transaction });

        // Calcular total pagado
        const pagos = await Pago.findAll({
            where: { orden_id },
            attributes: [[sequelize.fn('SUM', sequelize.col('monto')), 'total']],
            transaction
        });

        const totalPagado = parseFloat(pagos[0].dataValues.total || 0);
        
        // Determinar nuevo estado
        let nuevoEstado = 'pendiente';
        if (totalPagado >= parseFloat(orden.total)) {
            nuevoEstado = 'terminado';
        }

        // Actualizar orden
        await orden.update({ estado: nuevoEstado }, { transaction });

        // Registrar en log
        await sequelize.query(
            'INSERT INTO logs_actividad (usuario_id, accion, entidad_tipo, entidad_id, detalle, creado_en) VALUES (?, ?, ?, ?, ?, NOW())',
            {
                replacements: [
                    req.usuario.id,
                    'registrar_pago',
                    'pago',
                    pago.id,
                    JSON.stringify({ orden_id, monto, metodo: metodo_pago })
                ],
                transaction
            }
        );

        await transaction.commit();

        logger.info(`Pago registrado - Orden: ${orden_id}, Monto: ${monto}, Nuevo estado: ${nuevoEstado}`);

        res.status(201).json({
            mensaje: 'Pago registrado correctamente',
            pago,
            nuevo_estado: nuevoEstado
        });

    } catch (error) {
        await transaction.rollback();
        logger.error('Error registrando pago:', error);
        res.status(500).json({ error: 'Error al registrar pago' });
    }
};

const obtenerPagosPorOrden = async (req, res) => {
    try {
        const { ordenId } = req.params;
        
        const pagos = await Pago.findAll({
            where: { orden_id: ordenId },
            order: [['creado_en', 'DESC']]
        });

        res.json(pagos);
    } catch (error) {
        logger.error('Error obteniendo pagos:', error);
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
};

const eliminarPago = async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await Pago.findByPk(id);

        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        await pago.destroy();

        logger.info(`Pago eliminado - ID: ${id}`);

        res.json({
            mensaje: 'Pago eliminado correctamente'
        });

    } catch (error) {
        logger.error('Error eliminando pago:', error);
        res.status(500).json({ error: 'Error al eliminar pago' });
    }
};
const actualizarPago = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto, metodo_pago, referencia } = req.body;

        // Validar que el monto sea un número válido
        if (!monto || isNaN(parseFloat(monto)) || parseFloat(monto) <= 0) {
            return res.status(400).json({ error: 'Monto inválido' });
        }

        const pago = await Pago.findByPk(id);
        
        if (!pago) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        // Verificar que la orden sigue activa
        const orden = await Orden.findByPk(pago.orden_id);
        if (!orden || !orden.activo) {
            return res.status(400).json({ error: 'La orden asociada no está activa' });
        }

        // Calcular el total de otros pagos (excluyendo el actual)
        const [result] = await sequelize.query(
            'SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE orden_id = ? AND id != ?',
            { replacements: [pago.orden_id, id] }
        );

        const totalOtrosPagos = parseFloat(result[0]?.total || 0);
        const nuevoTotalPagado = totalOtrosPagos + parseFloat(monto);
        const totalOrden = parseFloat(orden.total);

        // Validar que no exceda el total de la orden
        if (nuevoTotalPagado > totalOrden) {
            const maximoPermitido = totalOrden - totalOtrosPagos;
            return res.status(400).json({ 
                error: 'El monto total de pagos no puede exceder el total de la orden',
                maximoPermitido: maximoPermitido.toFixed(2)
            });
        }

        // Actualizar pago
        await pago.update({
            monto: parseFloat(monto),
            metodo_pago,
            referencia
        });

        // Actualizar estado de la orden
        let nuevoEstado = orden.estado;
        if (nuevoTotalPagado >= totalOrden) {
            nuevoEstado = 'terminado';
        } else if (orden.estado === 'terminado' && nuevoTotalPagado < totalOrden) {
            nuevoEstado = 'pendiente';
        }

        if (nuevoEstado !== orden.estado) {
            await orden.update({ estado: nuevoEstado });
        }

        // Registrar en log
        await sequelize.query(
            'INSERT INTO logs_actividad (usuario_id, accion, entidad_tipo, entidad_id, detalle, creado_en) VALUES (?, ?, ?, ?, ?, NOW())',
            {
                replacements: [
                    req.usuario.id,
                    'actualizar_pago',
                    'pago',
                    pago.id,
                    JSON.stringify({ 
                        orden_id: pago.orden_id, 
                        monto_anterior: pago.monto,
                        monto_nuevo: monto,
                        metodo: metodo_pago 
                    })
                ]
            }
        );

        logger.info(`Pago actualizado - ID: ${id}, Nuevo monto: ${monto}`);

        res.json({
            mensaje: 'Pago actualizado correctamente',
            pago,
            nuevo_estado: nuevoEstado
        });

    } catch (error) {
        logger.error('Error actualizando pago:', error);
        res.status(500).json({ error: 'Error al actualizar pago' });
    }
};


module.exports = {
    registrarPago,
    obtenerPagosPorOrden,
    eliminarPago,
    actualizarPago
};
const { Orden, Doctor, Servicio, Pago, sequelize, Op  } = require('../models');
const logger = require('../utils/logger');

const obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await Orden.findAll({
            include: [
                { 
                    model: Doctor, 
                    as: 'doctor',
                    attributes: ['id', 'nombre', 'telefono_whatsapp', 'logo_url']
                },
                { 
                    model: Servicio, 
                    as: 'servicio',
                    attributes: ['id', 'nombre']
                },
                { 
                    model: Pago, 
                    as: 'pagos',
                    required: false
                }
            ],
            order: [['fecha_registro', 'DESC']]
        });

        res.json(ordenes);
    } catch (error) {
        logger.error('Error obteniendo órdenes:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
};

const crearOrden = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const ordenData = {
            doctor_id: req.body.doctor_id,
            servicio_id: req.body.servicio_id,
            total: req.body.total,
            prioridad: req.body.prioridad || 'normal',
            fecha_limite: req.body.fecha_limite || null,
            hora_limite: req.body.hora_limite || null,
            cliente_nombre: req.body.cliente_nombre || null,
            usuario_creo_id: req.usuario.id,
            id_externo: `ORD-${Date.now()}`
        };

        const orden = await Orden.create(ordenData, { transaction });

        if (req.body.pago_inicial && req.body.pago_inicial > 0) {
            await Pago.create({
                orden_id: orden.id,
                monto: req.body.pago_inicial,
                metodo_pago: req.body.metodo_pago || 'efectivo',
                usuario_registro_id: req.usuario.id,
                cliente_nombre: 'Pago inicial'
            }, { transaction });
        }

        await transaction.commit();

        logger.info(`Orden creada - ID: ${orden.id}, Usuario: ${req.usuario.id}`);

        res.status(201).json({
            mensaje: 'Orden creada correctamente',
            orden
        });

    } catch (error) {
        await transaction.rollback();
        logger.error('Error creando orden:', error);
        res.status(500).json({ error: 'Error al crear orden' });
    }
};

const actualizarOrden = async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await Orden.findByPk(id);

        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        const datosActualizados = {
            doctor_id: req.body.doctor_id,
            servicio_id: req.body.servicio_id,
            total: req.body.total,
            prioridad: req.body.prioridad,
            fecha_limite: req.body.fecha_limite || null,
            hora_limite: req.body.hora_limite || null,
            cliente_nombre: req.body.cliente_nombre
        };

        await orden.update(datosActualizados);

        res.json({
            mensaje: 'Orden actualizada correctamente',
            orden
        });

    } catch (error) {
        logger.error('Error actualizando orden:', error);
        res.status(500).json({ error: 'Error al actualizar orden' });
    }
};

const eliminarOrden = async (req, res) => {
    try {
        const { id } = req.params;
        
        const orden = await Orden.findByPk(id);

        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        // Eliminar los pagos asociados primero
        await Pago.destroy({ 
            where: { orden_id: id } 
        });
        
        // Eliminar la orden físicamente
        await orden.destroy();

        logger.info(`Orden eliminada físicamente - ID: ${id}, Externa: ${orden.id_externo}`);

        res.json({
            mensaje: 'Orden eliminada correctamente'
        });

    } catch (error) {
        logger.error('Error eliminando orden:', error);
        res.status(500).json({ error: 'Error al eliminar orden' });
    }
};

const obtenerEstadisticas = async (req, res) => {
    try {
        // Contar órdenes activas (pendientes)
        const ordenesActivas = await Orden.count({
            where: { estado: 'pendiente' }
        });
        
        // Contar órdenes vencidas
        const ordenesVencidas = await sequelize.query(`
            SELECT COUNT(*) as total FROM ordenes o
            WHERE o.estado = 'pendiente' 
              AND o.fecha_limite <= CURDATE()
              AND (o.total - COALESCE((SELECT SUM(p.monto) FROM pagos p WHERE p.orden_id = o.id), 0)) > 0
        `, { type: sequelize.QueryTypes.SELECT });
        
        // Contar órdenes terminadas
        const ordenesTerminadas = await Orden.count({
            where: { estado: 'terminado' }
        });
        
        // Caja del día - Usando consulta SQL directa para evitar problemas con Op
        const cajaHoyResult = await sequelize.query(`
            SELECT COALESCE(SUM(monto), 0) as total 
            FROM pagos 
            WHERE DATE(creado_en) = CURDATE()
        `, { type: sequelize.QueryTypes.SELECT });
        const cajaHoy = parseFloat(cajaHoyResult[0]?.total || 0);
        
        // Caja de la semana (últimos 7 días)
        const cajaSemanaResult = await sequelize.query(`
            SELECT COALESCE(SUM(monto), 0) as total 
            FROM pagos 
            WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        `, { type: sequelize.QueryTypes.SELECT });
        const cajaSemana = parseFloat(cajaSemanaResult[0]?.total || 0);
        
        res.json({
            ordenes_activas: ordenesActivas,
            ordenes_vencidas: ordenesVencidas[0]?.total || 0,
            ordenes_terminadas: ordenesTerminadas,
            caja_hoy: cajaHoy,
            caja_semana: cajaSemana
        });
    } catch (error) {
        logger.error('Error obteniendo estadísticas:', error);
        // Devolver un error más descriptivo para debugging
        res.status(500).json({ 
            error: 'Error al obtener estadísticas',
            details: error.message 
        });
    }
};

const obtenerOrdenPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        const orden = await Orden.findOne({
            where: { id: id },
            include: [
                { 
                    model: Doctor, 
                    as: 'doctor',
                    attributes: ['id', 'nombre', 'telefono_whatsapp', 'logo_url']
                },
                { 
                    model: Servicio, 
                    as: 'servicio',
                    attributes: ['id', 'nombre']
                },
                { 
                    model: Pago, 
                    as: 'pagos',
                    required: false,
                    order: [['creado_en', 'DESC']]
                }
            ]
        });

        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        res.json(orden);
    } catch (error) {
        logger.error('Error obteniendo orden por ID:', error);
        res.status(500).json({ error: 'Error al obtener la orden' });
    }
};

const obtenerIngresosMensuales = async (req, res) => {
    try {
        const ingresos = await sequelize.query(`
            SELECT 
                DATE_FORMAT(creado_en, '%Y-%m') as mes,
                MONTH(creado_en) as mes_numero,
                YEAR(creado_en) as año,
                SUM(monto) as total
            FROM pagos
            WHERE creado_en >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY YEAR(creado_en), MONTH(creado_en), DATE_FORMAT(creado_en, '%Y-%m')
            ORDER BY año ASC, mes_numero ASC
        `, { type: sequelize.QueryTypes.SELECT });

        const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        const resultado = [];
        const hoy = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
            const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            const mesNombre = nombresMeses[fecha.getMonth()];
            
            const ingreso = ingresos.find(i => i.mes === mesKey);
            
            resultado.push({
                mes: mesNombre,
                mes_completo: mesKey,
                total: ingreso ? parseFloat(ingreso.total) : 0
            });
        }

        res.json(resultado);
    } catch (error) {
        logger.error('Error obteniendo ingresos mensuales:', error);
        res.status(500).json({ error: 'Error al obtener ingresos mensuales' });
    }
};

const obtenerFechaServidor = (req, res) => {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    res.json({ fecha: `${anio}-${mes}-${dia}` });
};

module.exports = {
    obtenerOrdenes,
    obtenerOrdenPorId,
    crearOrden,
    actualizarOrden,
    eliminarOrden,
    obtenerEstadisticas,
    obtenerIngresosMensuales,
    obtenerFechaServidor
};
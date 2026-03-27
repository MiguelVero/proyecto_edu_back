const { Orden, Doctor, Servicio, Pago, sequelize } = require('../models');
const logger = require('../utils/logger');

const obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await Orden.findAll({
            where: { activo: true },
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
            hora_limite: req.body.hora_limite || null, // <-- NUEVO
            cliente_nombre: req.body.cliente_nombre || null,
            usuario_creo_id: req.usuario.id,
            id_externo: `ORD-${Date.now()}`
        };

        const orden = await Orden.create(ordenData, { transaction });

        // Si hay pago inicial
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
            hora_limite: req.body.hora_limite || null, // <-- NUEVO
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

        // Soft delete
        await orden.update({ activo: false });

        logger.info(`Orden eliminada - ID: ${id}`);

        res.json({
            mensaje: 'Orden eliminada correctamente'
        });

    } catch (error) {
        logger.error('Error eliminando orden:', error);
        res.status(500).json({ error: 'Error al eliminar orden' });
    }
};


// En obtenerEstadisticas, cambiar la condición
const obtenerEstadisticas = async (req, res) => {
    try {
        const stats = await sequelize.query(
            'SELECT * FROM vista_dashboard_metricas',
            { type: sequelize.QueryTypes.SELECT }
        );

        if (!stats || stats.length === 0) {
            const ordenesActivas = await Orden.count({
                where: { estado: 'pendiente', activo: true }
            });
            
            // CAMBIADO: fecha_limite <= CURDATE()
            const ordenesVencidas = await sequelize.query(`
                SELECT COUNT(*) as total FROM ordenes o
                WHERE o.activo = 1 
                  AND o.estado = 'pendiente' 
                  AND o.fecha_limite <= CURDATE()
                  AND (o.total - COALESCE((SELECT SUM(p.monto) FROM pagos p WHERE p.orden_id = o.id), 0)) > 0
            `, { type: sequelize.QueryTypes.SELECT });
            
            const ordenesTerminadas = await Orden.count({
                where: { estado: 'terminado' }
            });
            
            const cajaHoy = await Pago.sum('monto', {
                where: {
                    creado_en: {
                        [Op.gte]: new Date().setHours(0, 0, 0),
                        [Op.lte]: new Date().setHours(23, 59, 59)
                    }
                }
            }) || 0;
            
            const inicioSemana = new Date();
            inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
            inicioSemana.setHours(0, 0, 0);
            
            const cajaSemana = await Pago.sum('monto', {
                where: {
                    creado_en: {
                        [Op.gte]: inicioSemana
                    }
                }
            }) || 0;
            
            res.json({
                ordenes_activas: ordenesActivas,
                ordenes_vencidas: ordenesVencidas[0]?.total || 0,
                ordenes_terminadas: ordenesTerminadas,
                caja_hoy: cajaHoy,
                caja_semana: cajaSemana
            });
        } else {
            res.json(stats[0]);
        }
    } catch (error) {
        logger.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};
const obtenerOrdenPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        const orden = await Orden.findOne({
            where: { 
                id: id,
                activo: true 
            },
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
        // Obtener ingresos de los últimos 6 meses
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

        // Nombres de meses en español
        const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        // Crear array con los últimos 6 meses (incluyendo meses sin datos)
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
// Luego, en ordenRoutes.js, agrega la ruta: router.get('/server-time', autenticar, obtenerFechaServidor);





module.exports = {
    obtenerOrdenes,
    obtenerOrdenPorId,  // <-- AGREGAR ESTA LÍNEA
    crearOrden,
    actualizarOrden,
    eliminarOrden,
    obtenerEstadisticas,
    obtenerIngresosMensuales,
    obtenerFechaServidor
};
const express = require('express');
const router = express.Router();
const { 
    obtenerOrdenes, 
    obtenerOrdenPorId,  // <-- IMPORTAR LA NUEVA FUNCIÓN
    crearOrden, 
    actualizarOrden, 
    eliminarOrden,
    obtenerEstadisticas,
    obtenerIngresosMensuales,
    obtenerFechaServidor
} = require('../controllers/ordenController');
const { autenticar, autorizar } = require('../middleware/auth');
const { validarOrden } = require('../middleware/validator');

router.get('/', autenticar, obtenerOrdenes);
router.get('/estadisticas', autenticar, obtenerEstadisticas);
router.get('/ingresos/mensuales', autenticar, obtenerIngresosMensuales);
router.get('/:id', autenticar, obtenerOrdenPorId);  // <-- AGREGAR ESTA RUTA
router.post('/', autenticar, validarOrden, crearOrden);
router.put('/:id', autenticar, actualizarOrden);
router.delete('/:id', autenticar, autorizar('admin'), eliminarOrden);
router.get('/server-time', autenticar, obtenerFechaServidor);
module.exports = router;
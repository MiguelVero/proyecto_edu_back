// ordenRoutes.js - CORREGIDO (el orden es importante)
const express = require('express');
const router = express.Router();
const { 
    obtenerOrdenes, 
    obtenerOrdenPorId,
    crearOrden, 
    actualizarOrden, 
    eliminarOrden,
    obtenerEstadisticas,
    obtenerIngresosMensuales,
    obtenerFechaServidor  // <-- Asegúrate de importarlo
} = require('../controllers/ordenController');
const { autenticar, autorizar } = require('../middleware/auth');
const { validarOrden } = require('../middleware/validator');

// PRIMERO las rutas específicas (sin parámetros dinámicos)
router.get('/estadisticas', autenticar, obtenerEstadisticas);
router.get('/ingresos/mensuales', autenticar, obtenerIngresosMensuales);
router.get('/server-time', autenticar, obtenerFechaServidor);  // <-- ANTES de /:id

// LUEGO las rutas con parámetros
router.get('/', autenticar, obtenerOrdenes);
router.get('/:id', autenticar, obtenerOrdenPorId);
router.post('/', autenticar, validarOrden, crearOrden);
router.put('/:id', autenticar, actualizarOrden);
router.delete('/:id', autenticar, autorizar('admin'), eliminarOrden);

module.exports = router;
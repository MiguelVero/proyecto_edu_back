const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const config = require('../config/config'); // <-- IMPORTAR CONFIG
const { 
    obtenerDoctores, 
    obtenerDoctorPorId, 
    crearDoctor, 
    actualizarDoctor, 
    eliminarDoctor,
    obtenerResumenDoctor 
} = require('../controllers/doctorController');

const { autenticar, autorizar } = require('../middleware/auth');
const { body } = require('express-validator');
const { validarCampos } = require('../middleware/validator');

// Configuración de multer para subir imágenes
// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Usar directorio temporal
        cb(null, path.join(__dirname, '../../uploads/temp'));
    },
    filename: (req, file, cb) => {
        // Mantener nombre original pero con timestamp para evitar conflictos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `temp-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: config.maxFileSize },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|avif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, avif, webp)'));
        }
    }
});

// Validaciones
const validarDoctor = [
    body('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('telefono_whatsapp')
        .optional()
        .matches(/^[0-9+\-\s]+$/).withMessage('Teléfono inválido'),
    validarCampos
];

// Rutas
router.get('/', autenticar, obtenerDoctores);
router.get('/:id', autenticar, obtenerDoctorPorId);
router.get('/:id/resumen', autenticar, obtenerResumenDoctor);
router.post('/', 
    autenticar, 
    autorizar('admin', 'supervisor'),
    upload.single('logo'),
    validarDoctor,
    crearDoctor
);
router.put('/:id', 
    autenticar, 
    autorizar('admin', 'supervisor'),
    upload.single('logo'),
    validarDoctor,
    actualizarDoctor
);
router.delete('/:id', 
    autenticar, 
    autorizar('admin'),
    eliminarDoctor
);

module.exports = router;
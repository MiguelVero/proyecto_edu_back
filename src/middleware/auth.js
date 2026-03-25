const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const config = require('../config/config');
const logger = require('../utils/logger');

const autenticar = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        const usuario = await Usuario.findOne({ 
            where: { 
                id: decoded.id, 
                activo: true 
            } 
        });

        if (!usuario) {
            throw new Error();
        }

        req.usuario = usuario;
        req.token = token;
        next();
    } catch (error) {
        logger.warn('Intento de acceso no autorizado');
        res.status(401).json({ 
            error: 'Por favor, autentíquese para acceder a este recurso' 
        });
    }
};

const autorizar = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ 
                error: 'Usuario no autenticado' 
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            logger.warn(`Usuario ${req.usuario.id} intentó acceder sin permisos`);
            return res.status(403).json({ 
                error: 'No tiene permisos para acceder a este recurso' 
            });
        }

        next();
    };
};

module.exports = { autenticar, autorizar };
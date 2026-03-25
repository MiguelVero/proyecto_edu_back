const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    {
        host: config.db.host,
        port: config.db.port,
        dialect: config.db.dialect,
        logging: config.nodeEnv === 'development' ? console.log : false,
        pool: config.db.pool,
        timezone: '-05:00', // <-- AGREGAR ESTA LÍNEA para Perú (UTC-5)
        define: {
            timestamps: true,
            underscored: true,
            createdAt: 'creado_en',
            updatedAt: 'actualizado_en'
        }
    }
);

module.exports = sequelize;
process.env.TZ = 'America/Lima';  // Configurar zona horaria a Perú
const app = require('./src/app');
const config = require('./src/config/config');
const { sequelize } = require('./src/models');
const logger = require('./src/utils/logger');

const PORT = config.port || 3000;

// Verificar que la zona horaria se configuró correctamente
logger.info(`🕐 Zona horaria configurada: ${process.env.TZ}`);
logger.info(`🕐 Hora actual del servidor: ${new Date().toLocaleString('es-PE')}`);


// Verificar conexión a la base de datos
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        logger.info('Conexión a la base de datos establecida correctamente.');

        // Configurar la zona horaria de la conexión MySQL
        await sequelize.query("SET time_zone = '-05:00'");
        logger.info('🕐 Zona horaria MySQL configurada a Perú (UTC-5)');
        
       // Sincronizar modelos (solo en desarrollo)
        if (config.nodeEnv === 'development') {
            // Cambiar a false para evitar que intente recrear índices
            await sequelize.sync({ alter: false });
            logger.info('Modelos verificados con la base de datos.');
        }
    } catch (error) {
        logger.error('Error conectando a la base de datos:', error);
        process.exit(1);
    }
}

// Iniciar servidor
async function startServer() {
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
        logger.info(`
        =====================================
        🚀 Servidor corriendo en puerto: ${PORT}
        📝 Entorno: ${config.nodeEnv}
        🕐 Zona horaria: ${process.env.TZ}
        🔗 API URL: http://localhost:${PORT}/api
        =====================================
        `);
    });

    // Manejo de cierre graceful
    process.on('SIGTERM', () => {
        logger.info('SIGTERM recibido. Cerrando servidor...');
        server.close(() => {
            logger.info('Servidor cerrado.');
            sequelize.close();
        });
    });
}

startServer();
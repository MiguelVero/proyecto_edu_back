process.env.TZ = 'America/Lima';  // Configurar zona horaria a Perú
const app = require('./src/app');
const config = require('./src/config/config');
const { sequelize } = require('./src/models');
const logger = require('./src/utils/logger');

const PORT = config.port || 3000;

// Logs simples para Railway (funcionan siempre)
console.log(`🕐 Zona horaria configurada: ${process.env.TZ}`);
console.log(`🕐 Hora actual del servidor: ${new Date().toLocaleString('es-PE')}`);
console.log(`📝 Entorno: ${config.nodeEnv}`);
console.log(`🔧 Configuración DB: ${config.db.host}:${config.db.port}/${config.db.name}`);


// Verificar conexión a la base de datos
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        await sequelize.query("SET time_zone = '-05:00'");
        console.log('🕐 Zona horaria MySQL configurada a Perú (UTC-5)');
        
        if (config.nodeEnv === 'development') {
            await sequelize.sync({ alter: false });
            console.log('📊 Modelos verificados con la base de datos.');
        }
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
        process.exit(1);
    }
}


// Iniciar servidor
async function startServer() {
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
        console.log(`
        =====================================
        🚀 Servidor corriendo en puerto: ${PORT}
        📝 Entorno: ${config.nodeEnv}
        🕐 Zona horaria: ${process.env.TZ}
        🔗 API URL: http://localhost:${PORT}/api
        =====================================
        `);
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM recibido. Cerrando servidor...');
        server.close(() => {
            console.log('Servidor cerrado.');
            sequelize.close();
        });
    });
}

startServer();
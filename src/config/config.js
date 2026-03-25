const dotenv = require('dotenv');
const path = require('path');

// Solo cargar .env en desarrollo local
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, '../../.env') });
}

module.exports = {
    // App
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 3000,
    
    // Database - Soporta tanto variables locales como de Railway
    db: {
        host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
        port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
        name: process.env.DB_NAME || process.env.MYSQLDATABASE || 'labtrack_db',
        user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
        password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    
    // JWT
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    
    // Frontend
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
    
    // Uploads
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    
    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 100
    }
};
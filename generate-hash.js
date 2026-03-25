const bcrypt = require('bcryptjs');

async function generateHash() {
    try {
        const password = 'admin123';
        const hash = await bcrypt.hash(password, 10);
        
        console.log('=================================');
        console.log('🔐 Contraseña:', password);
        console.log('📦 Hash generado:', hash);
        console.log('=================================');
        console.log('\n📝 SQL para actualizar:');
        console.log(`UPDATE usuarios SET contrasena_hash = '${hash}' WHERE nombre_usuario = 'admin';`);
        
    } catch (error) {
        console.error('Error generando hash:', error);
    }
}

generateHash();
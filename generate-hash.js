const bcrypt = require('bcryptjs');

async function generateHash() {
    try {
        const password = 'edwardangel';
        const hash = await bcrypt.hash(password, 10);
        
        console.log('=================================');
        console.log('🔐 Usuario: edwardvilla');
        console.log('🔐 Contraseña:', password);
        console.log('📦 Hash generado:', hash);
        console.log('=================================');
        console.log('\n📝 SQL para actualizar:');
        console.log(`UPDATE usuarios SET nombre_usuario = 'edwardvilla', contrasena_hash = '${hash}' WHERE id = 2;`);
        
    } catch (error) {
        console.error('Error generando hash:', error);
    }
}

generateHash();
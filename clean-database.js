const { sequelize } = require('./src/models');

async function cleanDatabase() {
    try {
        console.log('🧹 Limpiando base de datos...');
        
        // 1. Verificar si las columnas existen
        console.log('📊 Verificando columnas...');
        
        const [creadoExists] = await sequelize.query(`
            SELECT COUNT(*) as exist FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'labtrack_db' 
            AND TABLE_NAME = 'configuraciones' 
            AND COLUMN_NAME = 'creado_en'
        `);
        
        const [actualizadoExists] = await sequelize.query(`
            SELECT COUNT(*) as exist FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'labtrack_db' 
            AND TABLE_NAME = 'configuraciones' 
            AND COLUMN_NAME = 'actualizado_en'
        `);

        // 2. Crear columnas si no existen
        if (creadoExists[0].exist === 0) {
            console.log('➕ Creando columna creado_en...');
            await sequelize.query(`
                ALTER TABLE configuraciones 
                ADD COLUMN creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
            `);
        } else {
            console.log('✅ Columna creado_en ya existe');
        }

        if (actualizadoExists[0].exist === 0) {
            console.log('➕ Creando columna actualizado_en...');
            await sequelize.query(`
                ALTER TABLE configuraciones 
                ADD COLUMN actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            `);
        } else {
            console.log('✅ Columna actualizado_en ya existe');
        }

        // 3. Actualizar registros con fechas inválidas
        console.log('🔄 Actualizando fechas inválidas...');
        
        await sequelize.query(`
            UPDATE configuraciones 
            SET creado_en = CURRENT_TIMESTAMP 
            WHERE creado_en = '0000-00-00 00:00:00' OR creado_en IS NULL
        `);
        
        await sequelize.query(`
            UPDATE configuraciones 
            SET actualizado_en = CURRENT_TIMESTAMP 
            WHERE actualizado_en = '0000-00-00 00:00:00' OR actualizado_en IS NULL
        `);

        console.log('✅ Base de datos limpiada correctamente');
        
        // 4. Mostrar resultados
        const [registros] = await sequelize.query(`
            SELECT id, clave, creado_en, actualizado_en 
            FROM configuraciones
        `);
        
        console.log('\n📋 Registros actualizados:');
        registros.forEach(r => {
            console.log(`   - ${r.clave}: creado=${r.creado_en}, actualizado=${r.actualizado_en}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.original) {
            console.error('Detalle:', error.original.message);
        }
    } finally {
        await sequelize.close();
    }
}

cleanDatabase();
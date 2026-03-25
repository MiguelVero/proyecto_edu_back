const http = require('http');

async function checkEndpoint(path, method = 'GET', token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Origin': 'http://localhost:4200',
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: data ? JSON.parse(data) : null
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject({
                message: error.message,
                code: error.code
            });
        });
        
        req.end();
    });
}

async function runDiagnostics() {
    console.log('🔍 DIAGNÓSTICO COMPLETO DEL BACKEND');
    console.log('====================================\n');

    try {
        // 1. Health check
        console.log('1️⃣ Health check:');
        const health = await checkEndpoint('/health');
        console.log('   ✅ Status:', health.status);
        console.log('   ✅ Response:', health.data);
        console.log('   ✅ CORS Headers:', health.headers['access-control-allow-origin']);

        // 2. OPTIONS preflight
        console.log('\n2️⃣ OPTIONS preflight:');
        const options = await checkEndpoint('/api/ordenes', 'OPTIONS');
        console.log('   ✅ Status:', options.status);
        console.log('   ✅ CORS Headers:', options.headers['access-control-allow-origin']);
        console.log('   ✅ Allow Methods:', options.headers['access-control-allow-methods']);

        // 3. Ping público
        console.log('\n3️⃣ Ping público:');
        const ping = await checkEndpoint('/api/ping');
        console.log('   ✅ Status:', ping.status);
        console.log('   ✅ Message:', ping.data?.message);

        // 4. GET a ordenes (sin auth, debería dar 401)
        console.log('\n4️⃣ GET /api/ordenes (sin auth):');
        const ordenes = await checkEndpoint('/api/ordenes');
        console.log('   ✅ Status:', ordenes.status);
        console.log('   ✅ Response:', ordenes.data);

        console.log('\n====================================');
        console.log('✅ Diagnóstico completado exitosamente');
        console.log('====================================');

    } catch (error) {
        console.error('\n❌ Error en diagnóstico:', error);
        console.log('\n🔧 Posibles soluciones:');
        console.log('1. Verificar que el backend esté corriendo: npm run dev');
        console.log('2. Verificar que no haya errores en la terminal del backend');
        console.log('3. Verificar que el puerto 3000 no esté ocupado');
        console.log('4. Verificar firewall o antivirus');
    }
}

runDiagnostics();
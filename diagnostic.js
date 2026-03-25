const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DO PROJETO UNIVERSE EMPADA');
console.log('='.repeat(50));

console.log('\n📌 LOCAL ATUAL:');
console.log(  );

console.log('\n📌 ARQUIVOS DO PROJETO:');
const filesToCheck = ['package.json', 'src/main/main.js', 'src/backend/server.js', '.env'];
filesToCheck.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(   );
});

if (fs.existsSync('.env')) {
    console.log('\n📌 CONTEÚDO DO .ENV (credenciais ocultas):');
    const content = fs.readFileSync('.env', 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
            if (line.includes('PASSWORD')) {
                console.log(  =*****);
            } else {
                console.log(  );
            }
        }
    });
}

console.log('\n📌 NODE_MODULES:');
const nmExists = fs.existsSync('node_modules');
console.log(  node_modules: );
if (nmExists) {
    const packages = ['electron', 'express', 'mysql2'];
    packages.forEach(pkg => {
        const exists = fs.existsSync(
ode_modules/);
        console.log(  : );
    });
}

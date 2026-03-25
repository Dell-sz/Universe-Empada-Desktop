const fs = require('fs');
const path = require('path');

console.log('=== Universe da Empada - Pós-instalação ===');

// Criar .env padrão se não existir
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    const defaultEnv = `DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=universe_empada
DB_PORT=3306
SERVER_PORT=3001
PORT=3001
NODE_ENV=production`;
    
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Arquivo .env criado');
}

console.log('⚠️  Certifique-se que o MySQL está instalado e rodando');
console.log('   Para iniciar: net start MySQL84');
console.log('');

console.log('✅ Configuração concluída!');
console.log('   O backend será iniciado automaticamente com o app.');

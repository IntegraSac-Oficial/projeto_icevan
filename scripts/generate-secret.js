const crypto = require('crypto');

// Gera uma chave secreta segura de 64 bytes (512 bits)
const secret = crypto.randomBytes(64).toString('base64');

console.log('🔐 Chave secreta gerada:');
console.log(secret);
console.log('\n💡 Adicione esta linha ao seu arquivo .env:');
console.log(`NEXTAUTH_SECRET="${secret}"`);
console.log('\n⚠️  IMPORTANTE: Mantenha esta chave em segredo!');
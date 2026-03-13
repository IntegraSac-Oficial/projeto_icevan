const fs = require('fs');
const path = require('path');

console.log('🔍 Validando variáveis de ambiente...');

// Carregar variáveis do .env ANTES de qualquer verificação
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('[dotenv] Carregando variáveis do arquivo .env');
} else {
  console.error('❌ Arquivo .env não encontrado!');
  console.log('💡 Copie o arquivo .env.example para .env e configure as variáveis');
  process.exit(1);
}

// Variáveis obrigatórias
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
];

// Variáveis opcionais mas recomendadas
const optionalEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT', 
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM'
];

let hasErrors = false;
let hasWarnings = false;

// Verificar variáveis obrigatórias
console.log('\n📋 Verificando variáveis obrigatórias:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.error(`❌ ${varName}: AUSENTE ou VAZIA`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}: OK`);
  }
});

// Verificar variáveis opcionais
console.log('\n📋 Verificando variáveis opcionais:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.warn(`⚠️  ${varName}: AUSENTE (funcionalidade limitada)`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${varName}: OK`);
  }
});

// Validações específicas
console.log('\n🔧 Validações específicas:');

// Validar DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  if (!dbUrl.startsWith('mysql://')) {
    console.error('❌ DATABASE_URL deve começar com "mysql://"');
    hasErrors = true;
  } else {
    console.log('✅ DATABASE_URL: Formato válido');
  }
}

// Validar SMTP_PORT
const smtpPort = process.env.SMTP_PORT;
if (smtpPort && (isNaN(smtpPort) || parseInt(smtpPort) <= 0)) {
  console.error('❌ SMTP_PORT deve ser um número válido');
  hasErrors = true;
}

// Resultado final
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ VALIDAÇÃO FALHOU - Corrija os erros acima');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('⚠️  VALIDAÇÃO COM AVISOS - Algumas funcionalidades podem estar limitadas');
  process.exit(0);
} else {
  console.log('✅ VALIDAÇÃO PASSOU - Todas as variáveis estão configuradas');
  process.exit(0);
}
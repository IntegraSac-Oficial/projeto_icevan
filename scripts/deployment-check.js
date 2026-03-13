#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Verificação pré-deployment...\n');

let hasErrors = false;

// 1. Verificar se todos os arquivos necessários existem
console.log('📁 Verificando arquivos necessários:');
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'Dockerfile',
  '.dockerignore',
  'prisma/schema.prisma',
  'scripts/ensure-directories.js',
  'healthcheck.js'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ ${file} - AUSENTE`);
    hasErrors = true;
  }
});

// 2. Verificar variáveis de ambiente
console.log('\n🔧 Verificando variáveis de ambiente:');
try {
  execSync('node scripts/validate-env.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Validação de variáveis de ambiente falhou');
  hasErrors = true;
}

// 3. Verificar se o Prisma client pode ser gerado
console.log('\n🗄️  Verificando Prisma:');
try {
  execSync('npx prisma generate', { stdio: 'pipe' });
  console.log('✅ Prisma client gerado com sucesso');
} catch (error) {
  console.error('❌ Falha ao gerar Prisma client');
  console.error(error.message);
  hasErrors = true;
}

// 4. Verificar se o build funciona
console.log('\n🏗️  Testando build:');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build executado com sucesso');
} catch (error) {
  console.error('❌ Falha no build');
  console.error(error.message);
  hasErrors = true;
}

// 5. Verificar estrutura de diretórios
console.log('\n📂 Verificando estrutura de diretórios:');
const requiredDirs = [
  'public/images/logo',
  'public/images/hero',
  'public/images/aplicacoes',
  'public/images/empresa',
  'public/images/galeria',
  'public/images/formas-pagamento'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.warn(`⚠️  ${dir} - será criado durante o build`);
  }
});

// Resultado final
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('❌ VERIFICAÇÃO FALHOU - Corrija os erros antes do deployment');
  console.log('\n💡 Dicas para resolver:');
  console.log('   • Verifique se todas as variáveis de ambiente estão configuradas');
  console.log('   • Execute: npm install');
  console.log('   • Execute: npx prisma generate');
  console.log('   • Verifique se o banco de dados está acessível');
  process.exit(1);
} else {
  console.log('✅ VERIFICAÇÃO PASSOU - Pronto para deployment!');
  console.log('\n🚀 Para fazer o deployment:');
  console.log('   • Docker: npm run docker:build && npm run docker:run');
  console.log('   • Docker Compose: docker-compose up --build');
  process.exit(0);
}
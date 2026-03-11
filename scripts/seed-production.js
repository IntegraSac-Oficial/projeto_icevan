#!/usr/bin/env node

/**
 * Script para popular o banco de produção com dados iniciais
 * Executa no container de produção
 */

const { execSync } = require('child_process');

console.log('🌱 Executando seed no ambiente de produção...');

try {
  // Executa o seed
  execSync('npx tsx scripts/seed-empresa-config.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Seed executado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao executar seed:', error.message);
  process.exit(1);
}
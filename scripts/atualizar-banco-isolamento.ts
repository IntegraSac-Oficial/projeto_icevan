import { prisma } from '@/lib/db';

async function atualizarBancoIsolamento() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO BANCO PARA ISOLAMENTO TÉRMICO');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Atualizar footer_rodape
    console.log('1️⃣  Atualizando footer_rodape...');
    await prisma.setting.update({
      where: { key: 'footer_rodape' },
      data: { value: 'CNPJ 54.206.345/0001-25 — Isolamento Térmico Veicular | São Paulo, SP' }
    });
    console.log('   ✅ Atualizado');

    // 2. Atualizar empresa_slogan
    console.log('2️⃣  Atualizando empresa_slogan...');
    await prisma.setting.update({
      where: { key: 'empresa_slogan' },
      data: { value: 'Isolamento Térmico Profissional para Veículos Utilitários' }
    });
    console.log('   ✅ Atualizado');

    // 3. Atualizar empresa_descricao
    console.log('3️⃣  Atualizando empresa_descricao...');
    await prisma.setting.update({
      where: { key: 'empresa_descricao' },
      data: { value: 'Especialistas em isolamento térmico e adaptação interna para vans, furgões e utilitários. Soluções personalizadas de revestimento, vedação e proteção térmica para transporte.' }
    });
    console.log('   ✅ Atualizado');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ PARTE 1 CONCLUÍDA');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarBancoIsolamento();

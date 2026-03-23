import { prisma } from '@/lib/db';

async function verificarDominio() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔍 VERIFICANDO ATUALIZAÇÃO DE DOMÍNIO');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // Verificar site_url
    const siteUrlResult = await prisma.$queryRaw<Array<{ key: string; value: string }>>`
      SELECT \`key\`, value
      FROM settings 
      WHERE \`key\` = 'site_url'
    `;
    
    console.log('1️⃣  site_url:');
    if (siteUrlResult.length > 0) {
      console.log(`   ${siteUrlResult[0].value}`);
    } else {
      console.log('   NÃO ENCONTRADO');
    }
    console.log('');

    // Contar registros com novo domínio
    const settingsCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM settings 
      WHERE value LIKE '%prot.icevanisolamento.com.br%'
    `;
    console.log(`2️⃣  Settings com novo domínio: ${settingsCount[0].count}`);

    const seoCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM seo_settings 
      WHERE ogImage LIKE '%prot.icevanisolamento.com.br%' 
         OR metaTitulo LIKE '%prot.icevanisolamento.com.br%' 
         OR metaDescricao LIKE '%prot.icevanisolamento.com.br%'
    `;
    console.log(`3️⃣  SEO Settings com novo domínio: ${seoCount[0].count}`);

    const bannersCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM hero_banners 
      WHERE titulo LIKE '%prot.icevanisolamento.com.br%' 
         OR descricao LIKE '%prot.icevanisolamento.com.br%'
    `;
    console.log(`4️⃣  Banners com novo domínio: ${bannersCount[0].count}`);
    console.log('');

    // Verificar se ainda há domínio antigo
    console.log('🔍 Verificando domínio antigo...');
    const oldDomain = await prisma.$queryRaw<Array<{ key: string; value: string }>>`
      SELECT \`key\`, value
      FROM settings 
      WHERE value LIKE '%icevanisolamento.com.br%'
        AND value NOT LIKE '%prot.icevanisolamento.com.br%'
      LIMIT 5
    `;

    if (oldDomain.length > 0) {
      console.log('   ⚠️  Ainda há referências ao domínio antigo:');
      oldDomain.forEach(row => {
        console.log(`      - ${row.key}: ${row.value}`);
      });
    } else {
      console.log('   ✅ Nenhuma referência ao domínio antigo em settings!');
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ VERIFICAÇÃO CONCLUÍDA');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarDominio();

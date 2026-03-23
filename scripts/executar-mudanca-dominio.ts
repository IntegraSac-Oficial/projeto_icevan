import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function atualizarDominio() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO DOMÍNIO NO BANCO DE DADOS');
  console.log('De: icevanisolamento.com.br → prot.icevanisolamento.com.br');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Atualizar site_url específico
    console.log('1️⃣  Atualizando site_url...');
    const siteUrlUpdate = await prisma.$executeRaw`
      UPDATE settings 
      SET value = 'https://prot.icevanisolamento.com.br'
      WHERE \`key\` = 'site_url'
    `;
    console.log(`   ✅ ${siteUrlUpdate} registro(s) atualizado(s)`);

    // 2. Atualizar todas as referências em settings (HTTPS)
    console.log('2️⃣  Atualizando referências HTTPS em settings...');
    const settingsHttps = await prisma.$executeRaw`
      UPDATE settings 
      SET value = REPLACE(value, 'https://icevanisolamento.com.br', 'https://prot.icevanisolamento.com.br')
      WHERE value LIKE '%https://icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${settingsHttps} registro(s) atualizado(s)`);

    // 3. Atualizar todas as referências em settings (HTTP)
    console.log('3️⃣  Atualizando referências HTTP em settings...');
    const settingsHttp = await prisma.$executeRaw`
      UPDATE settings 
      SET value = REPLACE(value, 'http://icevanisolamento.com.br', 'http://prot.icevanisolamento.com.br')
      WHERE value LIKE '%http://icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${settingsHttp} registro(s) atualizado(s)`);

    // 4. Atualizar domínio sem protocolo em settings
    console.log('4️⃣  Atualizando domínio sem protocolo em settings...');
    const settingsDomain = await prisma.$executeRaw`
      UPDATE settings 
      SET value = REPLACE(value, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
      WHERE value LIKE '%icevanisolamento.com.br%'
        AND value NOT LIKE '%prot.icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${settingsDomain} registro(s) atualizado(s)`);

    // 5. Atualizar ogImage em seo_settings (HTTPS)
    console.log('5️⃣  Atualizando ogImage em seo_settings (HTTPS)...');
    const seoOgHttps = await prisma.$executeRaw`
      UPDATE seo_settings 
      SET ogImage = REPLACE(ogImage, 'https://icevanisolamento.com.br', 'https://prot.icevanisolamento.com.br')
      WHERE ogImage LIKE '%https://icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${seoOgHttps} registro(s) atualizado(s)`);

    // 6. Atualizar ogImage em seo_settings (HTTP)
    console.log('6️⃣  Atualizando ogImage em seo_settings (HTTP)...');
    const seoOgHttp = await prisma.$executeRaw`
      UPDATE seo_settings 
      SET ogImage = REPLACE(ogImage, 'http://icevanisolamento.com.br', 'http://prot.icevanisolamento.com.br')
      WHERE ogImage LIKE '%http://icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${seoOgHttp} registro(s) atualizado(s)`);

    // 7. Atualizar ogImage em seo_settings (sem protocolo)
    console.log('7️⃣  Atualizando ogImage em seo_settings (sem protocolo)...');
    const seoOgDomain = await prisma.$executeRaw`
      UPDATE seo_settings 
      SET ogImage = REPLACE(ogImage, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
      WHERE ogImage LIKE '%icevanisolamento.com.br%'
        AND ogImage NOT LIKE '%prot.icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${seoOgDomain} registro(s) atualizado(s)`);

    // 8. Atualizar metaTitulo em seo_settings
    console.log('8️⃣  Atualizando metaTitulo em seo_settings...');
    const seoTitle = await prisma.$executeRaw`
      UPDATE seo_settings 
      SET metaTitulo = REPLACE(metaTitulo, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
      WHERE metaTitulo LIKE '%icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${seoTitle} registro(s) atualizado(s)`);

    // 9. Atualizar metaDescricao em seo_settings
    console.log('9️⃣  Atualizando metaDescricao em seo_settings...');
    const seoDesc = await prisma.$executeRaw`
      UPDATE seo_settings 
      SET metaDescricao = REPLACE(metaDescricao, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
      WHERE metaDescricao LIKE '%icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${seoDesc} registro(s) atualizado(s)`);

    // 10. Atualizar titulo em hero_banners
    console.log('🔟 Atualizando titulo em hero_banners...');
    const bannerTitle = await prisma.$executeRaw`
      UPDATE hero_banners 
      SET titulo = REPLACE(titulo, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
      WHERE titulo LIKE '%icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${bannerTitle} registro(s) atualizado(s)`);

    // 11. Atualizar descricao em hero_banners
    console.log('1️⃣1️⃣  Atualizando descricao em hero_banners...');
    const bannerDesc = await prisma.$executeRaw`
      UPDATE hero_banners 
      SET descricao = REPLACE(descricao, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
      WHERE descricao LIKE '%icevanisolamento.com.br%'
    `;
    console.log(`   ✅ ${bannerDesc} registro(s) atualizado(s)`);

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

    // Verificação
    console.log('📊 VERIFICAÇÃO:');
    console.log('');

    const settingsCheck = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM settings 
      WHERE value LIKE '%prot.icevanisolamento.com.br%'
    `;
    console.log(`   Settings com novo domínio: ${settingsCheck[0].count}`);

    const seoCheck = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM seo_settings 
      WHERE ogImage LIKE '%prot.icevanisolamento.com.br%' 
         OR metaTitulo LIKE '%prot.icevanisolamento.com.br%' 
         OR metaDescricao LIKE '%prot.icevanisolamento.com.br%'
    `;
    console.log(`   SEO Settings com novo domínio: ${seoCheck[0].count}`);

    const bannersCheck = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM hero_banners 
      WHERE titulo LIKE '%prot.icevanisolamento.com.br%' 
         OR descricao LIKE '%prot.icevanisolamento.com.br%'
    `;
    console.log(`   Banners com novo domínio: ${bannersCheck[0].count}`);

    console.log('');
    console.log('🔍 Verificando se ainda há domínio antigo...');
    
    const oldDomainCheck = await prisma.$queryRaw<Array<{ tabela: string; key: string; value: string }>>`
      SELECT 
        'settings' as tabela,
        \`key\`,
        value
      FROM settings 
      WHERE value LIKE '%icevanisolamento.com.br%'
        AND value NOT LIKE '%prot.icevanisolamento.com.br%'
      LIMIT 5
    `;

    if (oldDomainCheck.length > 0) {
      console.log('   ⚠️  Ainda há referências ao domínio antigo:');
      oldDomainCheck.forEach((row: any) => {
        console.log(`      - ${row.tabela}.${row.key}: ${row.value.substring(0, 100)}...`);
      });
    } else {
      console.log('   ✅ Nenhuma referência ao domínio antigo encontrada!');
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 PRONTO! Banco de dados atualizado para:');
    console.log('   https://prot.icevanisolamento.com.br');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ ERRO ao atualizar banco de dados:');
    console.error(error);
    console.error('');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarDominio();

import { prisma } from '@/lib/db';

async function verificarTextosBanco() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔍 VERIFICANDO TEXTOS NO BANCO DE DADOS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Verificar settings
    console.log('1️⃣  SETTINGS:');
    const settings = await prisma.setting.findMany({
      where: {
        OR: [
          { value: { contains: 'refrigeração' } },
          { value: { contains: 'refrigera' } },
        ]
      }
    });
    
    if (settings.length > 0) {
      console.log(`   ⚠️  Encontradas ${settings.length} settings com "refrigeração":`);
      settings.forEach(s => {
        console.log(`      - ${s.key}: ${s.value.substring(0, 100)}...`);
      });
    } else {
      console.log('   ✅ Nenhuma setting com "refrigeração"');
    }
    console.log('');

    // 2. Verificar hero banners
    console.log('2️⃣  HERO BANNERS:');
    const banners = await prisma.heroBanner.findMany();
    const bannersComRefrig = banners.filter(b => 
      b.titulo?.toLowerCase().includes('refrigera') || 
      b.descricao?.toLowerCase().includes('refrigera')
    );
    
    if (bannersComRefrig.length > 0) {
      console.log(`   ⚠️  Encontrados ${bannersComRefrig.length} banners com "refrigeração":`);
      bannersComRefrig.forEach(b => {
        console.log(`      - Título: ${b.titulo}`);
        console.log(`        Descrição: ${b.descricao}`);
      });
    } else {
      console.log('   ✅ Nenhum banner com "refrigeração"');
    }
    console.log('');

    // 3. Verificar SEO settings
    console.log('3️⃣  SEO SETTINGS:');
    const seoSettings = await prisma.seoSetting.findMany();
    const seoComRefrig = seoSettings.filter(s => 
      s.metaTitulo?.toLowerCase().includes('refrigera') || 
      s.metaDescricao?.toLowerCase().includes('refrigera')
    );
    
    if (seoComRefrig.length > 0) {
      console.log(`   ⚠️  Encontradas ${seoComRefrig.length} SEO settings com "refrigeração":`);
      seoComRefrig.forEach(s => {
        console.log(`      - Página: ${s.pageSlug}`);
        console.log(`        Título: ${s.metaTitulo}`);
        console.log(`        Descrição: ${s.metaDescricao?.substring(0, 100)}...`);
      });
    } else {
      console.log('   ✅ Nenhuma SEO setting com "refrigeração"');
    }
    console.log('');

    // 4. Verificar vídeos
    console.log('4️⃣  VÍDEOS:');
    const videos = await prisma.video.findMany();
    const videosComRefrig = videos.filter(v => 
      v.titulo?.toLowerCase().includes('refrigera')
    );
    
    if (videosComRefrig.length > 0) {
      console.log(`   ⚠️  Encontrados ${videosComRefrig.length} vídeos com "refrigeração":`);
      videosComRefrig.forEach(v => {
        console.log(`      - ${v.titulo}`);
      });
    } else {
      console.log('   ✅ Nenhum vídeo com "refrigeração"');
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

verificarTextosBanco();

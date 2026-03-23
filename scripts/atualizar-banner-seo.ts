import { prisma } from '@/lib/db';

async function atualizarBannerSeo() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO BANNER E SEO SETTINGS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // 1. Atualizar banner hero com refrigeração
    console.log('1️⃣  Atualizando banner hero...');
    const bannerRefrig = await prisma.heroBanner.findFirst({
      where: {
        OR: [
          { titulo: { contains: 'Refrigeração' } },
          { descricao: { contains: 'refrigeração' } }
        ]
      }
    });
    
    if (bannerRefrig) {
      await prisma.heroBanner.update({
        where: { id: bannerRefrig.id },
        data: {
          titulo: 'Revestimento e Acabamento Interno',
          descricao: 'Materiais de primeira linha para proteção, higiene e durabilidade'
        }
      });
      console.log('   ✅ Banner atualizado');
    } else {
      console.log('   ℹ️  Nenhum banner com refrigeração encontrado');
    }

    // 2. Atualizar SEO Settings
    console.log('');
    console.log('2️⃣  Atualizando SEO Settings...');
    
    // Home
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/' },
      update: {
        metaTitulo: 'Isolamento Térmico para Van | Ice Van',
        metaDescricao: 'Serviço de isolamento térmico e adaptação interna para van, Master, Sprinter, Ducato, Fiorino. Revestimento profissional, vedação e acabamento de alta qualidade.'
      },
      create: {
        pageSlug: '/',
        metaTitulo: 'Isolamento Térmico para Van | Ice Van',
        metaDescricao: 'Serviço de isolamento térmico e adaptação interna para van, Master, Sprinter, Ducato, Fiorino. Revestimento profissional, vedação e acabamento de alta qualidade.'
      }
    });
    console.log('   ✅ Home');

    // Empresa
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/empresa' },
      update: {
        metaTitulo: 'Empresa | Especialistas em Isolamento Térmico Veicular',
        metaDescricao: 'Conheça a Ice Van, empresa de São Paulo especializada em isolamento térmico veicular, adaptação interna e revestimento para vans e utilitários.'
      },
      create: {
        pageSlug: '/empresa',
        metaTitulo: 'Empresa | Especialistas em Isolamento Térmico Veicular',
        metaDescricao: 'Conheça a Ice Van, empresa de São Paulo especializada em isolamento térmico veicular, adaptação interna e revestimento para vans e utilitários.'
      }
    });
    console.log('   ✅ Empresa');

    // Serviços e Fotos
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/servicos-e-fotos' },
      update: {
        metaTitulo: 'Fotos e Serviços | Portfólio de Isolamento Térmico',
        metaDescricao: 'Confira fotos e vídeos dos serviços da Ice Van com instalações de isolamento térmico veicular, revestimento interno e adaptação de vans e utilitários.'
      },
      create: {
        pageSlug: '/servicos-e-fotos',
        metaTitulo: 'Fotos e Serviços | Portfólio de Isolamento Térmico',
        metaDescricao: 'Confira fotos e vídeos dos serviços da Ice Van com instalações de isolamento térmico veicular, revestimento interno e adaptação de vans e utilitários.'
      }
    });
    console.log('   ✅ Serviços e Fotos');

    // Contato
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/contato' },
      update: {
        metaTitulo: 'Contato | Solicite Orçamento de Isolamento Térmico',
        metaDescricao: 'Fale com a Ice Van e solicite orçamento para isolamento térmico veicular, adaptação interna, revestimento e vedação para vans e utilitários.'
      },
      create: {
        pageSlug: '/contato',
        metaTitulo: 'Contato | Solicite Orçamento de Isolamento Térmico',
        metaDescricao: 'Fale com a Ice Van e solicite orçamento para isolamento térmico veicular, adaptação interna, revestimento e vedação para vans e utilitários.'
      }
    });
    console.log('   ✅ Contato');

    // Aplicações
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/aplicacoes' },
      update: {
        metaTitulo: 'Aplicações | Isolamento Térmico Veicular | Ice Van',
        metaDescricao: 'Soluções de isolamento térmico e adaptação interna para Fiorino, Ducato, Sprinter, Master e Expert. Projetos personalizados por veículo.'
      },
      create: {
        pageSlug: '/aplicacoes',
        metaTitulo: 'Aplicações | Isolamento Térmico Veicular | Ice Van',
        metaDescricao: 'Soluções de isolamento térmico e adaptação interna para Fiorino, Ducato, Sprinter, Master e Expert. Projetos personalizados por veículo.'
      }
    });
    console.log('   ✅ Aplicações');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ BANNER E SEO SETTINGS ATUALIZADOS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarBannerSeo();

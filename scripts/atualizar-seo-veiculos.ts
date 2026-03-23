import { prisma } from '@/lib/db';

async function atualizarSeoVeiculos() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔄 ATUALIZANDO SEO DOS VEÍCULOS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // Fiorinos
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/fiorinos' },
      update: {
        metaTitulo: 'Isolamento Térmico para Fiorino | Adaptação Profissional — Ice Van',
        metaDescricao: 'Isolamento térmico profissional para Fiat Fiorino. Revestimento interno, vedação e acabamento de alta qualidade para transporte de produtos sensíveis.'
      },
      create: {
        pageSlug: '/fiorinos',
        metaTitulo: 'Isolamento Térmico para Fiorino | Adaptação Profissional — Ice Van',
        metaDescricao: 'Isolamento térmico profissional para Fiat Fiorino. Revestimento interno, vedação e acabamento de alta qualidade para transporte de produtos sensíveis.'
      }
    });
    console.log('   ✅ Fiorinos');

    // Van Ducato
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/van-ducato' },
      update: {
        metaTitulo: 'Isolamento Térmico para Van Ducato | Fiat Ducato Adaptado — Ice Van',
        metaDescricao: 'Transforme seu Fiat Ducato com isolamento térmico profissional. Revestimento interno de alta qualidade e acabamento durável.'
      },
      create: {
        pageSlug: '/van-ducato',
        metaTitulo: 'Isolamento Térmico para Van Ducato | Fiat Ducato Adaptado — Ice Van',
        metaDescricao: 'Transforme seu Fiat Ducato com isolamento térmico profissional. Revestimento interno de alta qualidade e acabamento durável.'
      }
    });
    console.log('   ✅ Van Ducato');

    // Van Sprinter
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/van-sprinter' },
      update: {
        metaTitulo: 'Isolamento Térmico para Sprinter | Van Mercedes Adaptada — Ice Van',
        metaDescricao: 'Isolamento térmico de alta performance para Mercedes-Benz Sprinter. Revestimento profissional e acabamento robusto para grandes volumes.'
      },
      create: {
        pageSlug: '/van-sprinter',
        metaTitulo: 'Isolamento Térmico para Sprinter | Van Mercedes Adaptada — Ice Van',
        metaDescricao: 'Isolamento térmico de alta performance para Mercedes-Benz Sprinter. Revestimento profissional e acabamento robusto para grandes volumes.'
      }
    });
    console.log('   ✅ Van Sprinter');

    // Van Master
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/van-master' },
      update: {
        metaTitulo: 'Isolamento Térmico para Van Master | Renault Master Adaptada — Ice Van',
        metaDescricao: 'Soluções de isolamento térmico para Renault Master. Ótimo custo-benefício para frotas médias. Revestimento profissional e acabamento durável.'
      },
      create: {
        pageSlug: '/van-master',
        metaTitulo: 'Isolamento Térmico para Van Master | Renault Master Adaptada — Ice Van',
        metaDescricao: 'Soluções de isolamento térmico para Renault Master. Ótimo custo-benefício para frotas médias. Revestimento profissional e acabamento durável.'
      }
    });
    console.log('   ✅ Van Master');

    // Expert
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/expert-porta-frigorifica' },
      update: {
        metaTitulo: 'Expert com Porta Frigorífica | Citroën Peugeot Isolada — Ice Van',
        metaDescricao: 'Adaptação da Citroën/Peugeot Expert com porta frigorífica de alta vedação e isolamento térmico profissional. Ideal para transporte urbano.'
      },
      create: {
        pageSlug: '/expert-porta-frigorifica',
        metaTitulo: 'Expert com Porta Frigorífica | Citroën Peugeot Isolada — Ice Van',
        metaDescricao: 'Adaptação da Citroën/Peugeot Expert com porta frigorífica de alta vedação e isolamento térmico profissional. Ideal para transporte urbano.'
      }
    });
    console.log('   ✅ Expert');

    // Isolamento Fiorino
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/isolamento-fiorino' },
      update: {
        metaTitulo: 'Isolamento Fiorino com Porta Frigorífica | Adaptação Profissional — Ice Van',
        metaDescricao: 'Fiat Fiorino com isolamento térmico profissional e porta frigorífica de alta vedação. Ideal para pequenas entregas urbanas de produtos sensíveis.'
      },
      create: {
        pageSlug: '/isolamento-fiorino',
        metaTitulo: 'Isolamento Fiorino com Porta Frigorífica | Adaptação Profissional — Ice Van',
        metaDescricao: 'Fiat Fiorino com isolamento térmico profissional e porta frigorífica de alta vedação. Ideal para pequenas entregas urbanas de produtos sensíveis.'
      }
    });
    console.log('   ✅ Isolamento Fiorino');

    // Fiorino Porta Frigorífica (slug antigo)
    await prisma.seoSetting.upsert({
      where: { pageSlug: '/fiorino-porta-frigorifica' },
      update: {
        metaTitulo: 'Fiorino com Porta Frigorífica | Isolamento Térmico — Ice Van',
        metaDescricao: 'Fiat Fiorino com porta frigorífica, isolamento térmico e adaptação interna para operações que exigem máxima eficiência térmica.'
      },
      create: {
        pageSlug: '/fiorino-porta-frigorifica',
        metaTitulo: 'Fiorino com Porta Frigorífica | Isolamento Térmico — Ice Van',
        metaDescricao: 'Fiat Fiorino com porta frigorífica, isolamento térmico e adaptação interna para operações que exigem máxima eficiência térmica.'
      }
    });
    console.log('   ✅ Fiorino Porta Frigorífica');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ SEO DOS VEÍCULOS ATUALIZADO');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarSeoVeiculos();

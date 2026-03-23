/**
 * ============================================================
 * SCRIPT DE REVERSÃO DE DOMÍNIO NO BANCO DE DADOS
 * De: prot.icevanisolamento.com.br → icevanisolamento.com.br
 * ============================================================
 * 
 * Este script executa a reversão do domínio no banco de dados local.
 * Mantém todo o reposicionamento de isolamento térmico intacto.
 * 
 * IMPORTANTE: Execute apenas no banco LOCAL
 * 
 * Como executar:
 * npm run tsx scripts/executar-reversao-dominio.ts
 */

import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const DOMINIO_ANTIGO = 'prot.icevanisolamento.com.br';
const DOMINIO_NOVO = 'icevanisolamento.com.br';

async function reverterDominio() {
  console.log('🔄 Iniciando reversão de domínio no banco de dados...\n');
  console.log(`   De: ${DOMINIO_ANTIGO}`);
  console.log(`   Para: ${DOMINIO_NOVO}\n`);

  let connection;

  try {
    // Conectar ao banco de dados
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL não encontrada no .env.local');
    }

    console.log('📡 Conectando ao banco de dados...');
    
    // Parse da URL do banco
    const dbUrl = new URL(databaseUrl);
    connection = await mysql.createConnection({
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port || '3306'),
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
    });

    console.log('✅ Conectado ao banco de dados\n');

    // ============================================================
    // 1. VERIFICAR ESTADO ATUAL
    // ============================================================
    console.log('🔍 Verificando estado atual do banco...\n');

    const [settingsComProt] = await connection.execute(
      `SELECT COUNT(*) as total FROM settings WHERE value LIKE ?`,
      [`%${DOMINIO_ANTIGO}%`]
    );
    
    const [seoComProt] = await connection.execute(
      `SELECT COUNT(*) as total FROM seo_settings 
       WHERE ogImage LIKE ? OR metaTitulo LIKE ? OR metaDescricao LIKE ?`,
      [`%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`]
    );

    const [bannersComProt] = await connection.execute(
      `SELECT COUNT(*) as total FROM hero_banners 
       WHERE titulo LIKE ? OR descricao LIKE ?`,
      [`%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`]
    );

    console.log(`   Settings com "${DOMINIO_ANTIGO}": ${(settingsComProt as any)[0].total}`);
    console.log(`   SEO Settings com "${DOMINIO_ANTIGO}": ${(seoComProt as any)[0].total}`);
    console.log(`   Hero Banners com "${DOMINIO_ANTIGO}": ${(bannersComProt as any)[0].total}\n`);

    const totalRegistros = 
      (settingsComProt as any)[0].total + 
      (seoComProt as any)[0].total + 
      (bannersComProt as any)[0].total;

    if (totalRegistros === 0) {
      console.log('ℹ️  Nenhum registro com domínio "prot" encontrado.');
      console.log('   O banco já está com o domínio original.\n');
      await connection.end();
      return;
    }

    console.log(`📊 Total de registros a serem revertidos: ${totalRegistros}\n`);

    // ============================================================
    // 2. EXECUTAR REVERSÃO
    // ============================================================
    console.log('🔄 Executando reversão...\n');

    // 2.1 Settings
    console.log('   → Revertendo tabela settings...');
    
    await connection.execute(
      `UPDATE settings SET value = ? WHERE \`key\` = 'site_url'`,
      [`https://${DOMINIO_NOVO}`]
    );

    await connection.execute(
      `UPDATE settings 
       SET value = REPLACE(value, ?, ?)
       WHERE value LIKE ?`,
      [`https://${DOMINIO_ANTIGO}`, `https://${DOMINIO_NOVO}`, `%https://${DOMINIO_ANTIGO}%`]
    );

    await connection.execute(
      `UPDATE settings 
       SET value = REPLACE(value, ?, ?)
       WHERE value LIKE ?`,
      [`http://${DOMINIO_ANTIGO}`, `http://${DOMINIO_NOVO}`, `%http://${DOMINIO_ANTIGO}%`]
    );

    await connection.execute(
      `UPDATE settings 
       SET value = REPLACE(value, ?, ?)
       WHERE value LIKE ?`,
      [DOMINIO_ANTIGO, DOMINIO_NOVO, `%${DOMINIO_ANTIGO}%`]
    );

    console.log('   ✅ Settings revertidos');

    // 2.2 SEO Settings
    console.log('   → Revertendo tabela seo_settings...');

    await connection.execute(
      `UPDATE seo_settings 
       SET ogImage = REPLACE(ogImage, ?, ?)
       WHERE ogImage LIKE ?`,
      [`https://${DOMINIO_ANTIGO}`, `https://${DOMINIO_NOVO}`, `%https://${DOMINIO_ANTIGO}%`]
    );

    await connection.execute(
      `UPDATE seo_settings 
       SET ogImage = REPLACE(ogImage, ?, ?)
       WHERE ogImage LIKE ?`,
      [`http://${DOMINIO_ANTIGO}`, `http://${DOMINIO_NOVO}`, `%http://${DOMINIO_ANTIGO}%`]
    );

    await connection.execute(
      `UPDATE seo_settings 
       SET ogImage = REPLACE(ogImage, ?, ?)
       WHERE ogImage LIKE ?`,
      [DOMINIO_ANTIGO, DOMINIO_NOVO, `%${DOMINIO_ANTIGO}%`]
    );

    await connection.execute(
      `UPDATE seo_settings 
       SET metaTitulo = REPLACE(metaTitulo, ?, ?)
       WHERE metaTitulo LIKE ?`,
      [DOMINIO_ANTIGO, DOMINIO_NOVO, `%${DOMINIO_ANTIGO}%`]
    );

    await connection.execute(
      `UPDATE seo_settings 
       SET metaDescricao = REPLACE(metaDescricao, ?, ?)
       WHERE metaDescricao LIKE ?`,
      [DOMINIO_ANTIGO, DOMINIO_NOVO, `%${DOMINIO_ANTIGO}%`]
    );

    console.log('   ✅ SEO Settings revertidos');

    // 2.3 Hero Banners
    console.log('   → Revertendo tabela hero_banners...');

    await connection.execute(
      `UPDATE hero_banners 
       SET titulo = REPLACE(titulo, ?, ?)
       WHERE titulo LIKE ?`,
      [DOMINIO_ANTIGO, DOMINIO_NOVO, `%${DOMINIO_ANTIGO}%`]
    );

    await connection.execute(
      `UPDATE hero_banners 
       SET descricao = REPLACE(descricao, ?, ?)
       WHERE descricao LIKE ?`,
      [DOMINIO_ANTIGO, DOMINIO_NOVO, `%${DOMINIO_ANTIGO}%`]
    );

    console.log('   ✅ Hero Banners revertidos\n');

    // ============================================================
    // 3. VERIFICAR RESULTADO
    // ============================================================
    console.log('🔍 Verificando resultado da reversão...\n');

    const [settingsRevertidos] = await connection.execute(
      `SELECT COUNT(*) as total FROM settings 
       WHERE value LIKE ? AND value NOT LIKE ?`,
      [`%${DOMINIO_NOVO}%`, `%${DOMINIO_ANTIGO}%`]
    );

    const [seoRevertidos] = await connection.execute(
      `SELECT COUNT(*) as total FROM seo_settings 
       WHERE (ogImage LIKE ? OR metaTitulo LIKE ? OR metaDescricao LIKE ?)
       AND ogImage NOT LIKE ? AND metaTitulo NOT LIKE ? AND metaDescricao NOT LIKE ?`,
      [
        `%${DOMINIO_NOVO}%`, `%${DOMINIO_NOVO}%`, `%${DOMINIO_NOVO}%`,
        `%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`
      ]
    );

    const [bannersRevertidos] = await connection.execute(
      `SELECT COUNT(*) as total FROM hero_banners 
       WHERE (titulo LIKE ? OR descricao LIKE ?)
       AND titulo NOT LIKE ? AND descricao NOT LIKE ?`,
      [`%${DOMINIO_NOVO}%`, `%${DOMINIO_NOVO}%`, `%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`]
    );

    console.log(`   Settings com domínio original: ${(settingsRevertidos as any)[0].total}`);
    console.log(`   SEO Settings com domínio original: ${(seoRevertidos as any)[0].total}`);
    console.log(`   Hero Banners com domínio original: ${(bannersRevertidos as any)[0].total}\n`);

    // Verificar se ainda existe algum registro com domínio prot
    const [settingsComProtAinda] = await connection.execute(
      `SELECT COUNT(*) as total FROM settings WHERE value LIKE ?`,
      [`%${DOMINIO_ANTIGO}%`]
    );

    const [seoComProtAinda] = await connection.execute(
      `SELECT COUNT(*) as total FROM seo_settings 
       WHERE ogImage LIKE ? OR metaTitulo LIKE ? OR metaDescricao LIKE ?`,
      [`%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`]
    );

    const [bannersComProtAinda] = await connection.execute(
      `SELECT COUNT(*) as total FROM hero_banners 
       WHERE titulo LIKE ? OR descricao LIKE ?`,
      [`%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`]
    );

    const totalProtRestante = 
      (settingsComProtAinda as any)[0].total + 
      (seoComProtAinda as any)[0].total + 
      (bannersComProtAinda as any)[0].total;

    if (totalProtRestante > 0) {
      console.log(`⚠️  ATENÇÃO: Ainda existem ${totalProtRestante} registros com "${DOMINIO_ANTIGO}"\n`);
      
      // Mostrar detalhes
      const [detalhesSettings] = await connection.execute(
        `SELECT \`key\`, value FROM settings WHERE value LIKE ?`,
        [`%${DOMINIO_ANTIGO}%`]
      );

      const [detalhesSeo] = await connection.execute(
        `SELECT pageSlug, ogImage, metaTitulo FROM seo_settings 
         WHERE ogImage LIKE ? OR metaTitulo LIKE ? OR metaDescricao LIKE ?`,
        [`%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`]
      );

      const [detalhesBanners] = await connection.execute(
        `SELECT id, titulo, descricao FROM hero_banners 
         WHERE titulo LIKE ? OR descricao LIKE ?`,
        [`%${DOMINIO_ANTIGO}%`, `%${DOMINIO_ANTIGO}%`]
      );

      if ((detalhesSettings as any[]).length > 0) {
        console.log('   Settings com prot:');
        (detalhesSettings as any[]).forEach((row: any) => {
          console.log(`     - ${row.key}: ${row.value}`);
        });
        console.log('');
      }

      if ((detalhesSeo as any[]).length > 0) {
        console.log('   SEO Settings com prot:');
        (detalhesSeo as any[]).forEach((row: any) => {
          console.log(`     - ${row.pageSlug}`);
        });
        console.log('');
      }

      if ((detalhesBanners as any[]).length > 0) {
        console.log('   Hero Banners com prot:');
        (detalhesBanners as any[]).forEach((row: any) => {
          console.log(`     - ID ${row.id}: ${row.titulo}`);
        });
        console.log('');
      }
    } else {
      console.log(`✅ Nenhum registro com "${DOMINIO_ANTIGO}" encontrado!\n`);
    }

    // ============================================================
    // 4. RESUMO FINAL
    // ============================================================
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ REVERSÃO DE DOMÍNIO CONCLUÍDA COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`   Domínio revertido: ${DOMINIO_NOVO}`);
    console.log(`   Registros atualizados: ${totalRegistros}`);
    console.log(`   Registros com prot restantes: ${totalProtRestante}\n`);
    console.log('📝 IMPORTANTE:');
    console.log('   - O reposicionamento de isolamento térmico foi mantido');
    console.log('   - Apenas o domínio foi revertido para o original');
    console.log('   - Você pode exportar o banco e importar no Coolify\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Erro ao reverter domínio:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Executar
reverterDominio();

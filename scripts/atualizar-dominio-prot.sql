-- ============================================================
-- SCRIPT DE ATUALIZAÇÃO DE DOMÍNIO
-- De: icevanisolamento.com.br → prot.icevanisolamento.com.br
-- ============================================================
-- Execute este script no banco de dados de produção após o deploy
-- ============================================================

-- Backup antes de executar (recomendado):
-- mysqldump -u root -p icevan > backup_antes_mudanca_dominio.sql

-- ============================================================
-- 1. ATUALIZAR CONFIGURAÇÕES GERAIS (settings)
-- ============================================================

-- Atualizar site_url
UPDATE settings 
SET value = 'https://prot.icevanisolamento.com.br'
WHERE `key` = 'site_url';

-- Atualizar qualquer outra referência ao domínio antigo
UPDATE settings 
SET value = REPLACE(value, 'https://icevanisolamento.com.br', 'https://prot.icevanisolamento.com.br')
WHERE value LIKE '%https://icevanisolamento.com.br%';

UPDATE settings 
SET value = REPLACE(value, 'http://icevanisolamento.com.br', 'http://prot.icevanisolamento.com.br')
WHERE value LIKE '%http://icevanisolamento.com.br%';

UPDATE settings 
SET value = REPLACE(value, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE value LIKE '%icevanisolamento.com.br%';

-- ============================================================
-- 2. ATUALIZAR SEO SETTINGS
-- ============================================================

-- Atualizar ogImage
UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'https://icevanisolamento.com.br', 'https://prot.icevanisolamento.com.br')
WHERE ogImage LIKE '%https://icevanisolamento.com.br%';

UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'http://icevanisolamento.com.br', 'http://prot.icevanisolamento.com.br')
WHERE ogImage LIKE '%http://icevanisolamento.com.br%';

UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE ogImage LIKE '%icevanisolamento.com.br%';

-- Atualizar metaTitulo
UPDATE seo_settings 
SET metaTitulo = REPLACE(metaTitulo, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE metaTitulo LIKE '%icevanisolamento.com.br%';

-- Atualizar metaDescricao
UPDATE seo_settings 
SET metaDescricao = REPLACE(metaDescricao, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE metaDescricao LIKE '%icevanisolamento.com.br%';

-- ============================================================
-- 3. ATUALIZAR BANNERS HERO
-- ============================================================

-- Atualizar titulo
UPDATE hero_banners 
SET titulo = REPLACE(titulo, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE titulo LIKE '%icevanisolamento.com.br%';

-- Atualizar descricao
UPDATE hero_banners 
SET descricao = REPLACE(descricao, 'icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE descricao LIKE '%icevanisolamento.com.br%';

-- ============================================================
-- 4. VERIFICAÇÃO (OPCIONAL - DESCOMENTE PARA EXECUTAR)
-- ============================================================

-- Verificar se as atualizações foram aplicadas
SELECT 
    'settings' as tabela,
    COUNT(*) as registros_com_novo_dominio
FROM settings 
WHERE value LIKE '%prot.icevanisolamento.com.br%'

UNION ALL

SELECT 
    'seo_settings' as tabela,
    COUNT(*) as registros_com_novo_dominio
FROM seo_settings 
WHERE ogImage LIKE '%prot.icevanisolamento.com.br%' 
   OR metaTitulo LIKE '%prot.icevanisolamento.com.br%' 
   OR metaDescricao LIKE '%prot.icevanisolamento.com.br%'

UNION ALL

SELECT 
    'hero_banners' as tabela,
    COUNT(*) as registros_com_novo_dominio
FROM hero_banners 
WHERE titulo LIKE '%prot.icevanisolamento.com.br%' 
   OR descricao LIKE '%prot.icevanisolamento.com.br%';

-- ============================================================
-- 5. VERIFICAR SE AINDA EXISTE DOMÍNIO ANTIGO (OPCIONAL)
-- ============================================================

-- Verificar se ainda há referências ao domínio antigo
SELECT 
    'settings' as tabela,
    `key`,
    value
FROM settings 
WHERE value LIKE '%icevanisolamento.com.br%'
  AND value NOT LIKE '%prot.icevanisolamento.com.br%'

UNION ALL

SELECT 
    'seo_settings' as tabela,
    pageSlug as `key`,
    CONCAT('ogImage: ', ogImage, ' | metaTitulo: ', metaTitulo) as value
FROM seo_settings 
WHERE (ogImage LIKE '%icevanisolamento.com.br%' 
   OR metaTitulo LIKE '%icevanisolamento.com.br%' 
   OR metaDescricao LIKE '%icevanisolamento.com.br%')
  AND ogImage NOT LIKE '%prot.icevanisolamento.com.br%'
  AND metaTitulo NOT LIKE '%prot.icevanisolamento.com.br%'
  AND metaDescricao NOT LIKE '%prot.icevanisolamento.com.br%';

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================

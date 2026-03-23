-- ============================================================
-- SCRIPT DE REVERSÃO DE DOMÍNIO
-- De: prot.icevanisolamento.com.br → icevanisolamento.com.br
-- ============================================================
-- Execute este script no banco de dados local
-- ============================================================

-- ============================================================
-- 1. ATUALIZAR CONFIGURAÇÕES GERAIS (settings)
-- ============================================================

-- Atualizar site_url
UPDATE settings 
SET value = 'https://icevanisolamento.com.br'
WHERE `key` = 'site_url';

-- Reverter qualquer referência ao domínio prot
UPDATE settings 
SET value = REPLACE(value, 'https://prot.icevanisolamento.com.br', 'https://icevanisolamento.com.br')
WHERE value LIKE '%https://prot.icevanisolamento.com.br%';

UPDATE settings 
SET value = REPLACE(value, 'http://prot.icevanisolamento.com.br', 'http://icevanisolamento.com.br')
WHERE value LIKE '%http://prot.icevanisolamento.com.br%';

UPDATE settings 
SET value = REPLACE(value, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE value LIKE '%prot.icevanisolamento.com.br%';

-- ============================================================
-- 2. ATUALIZAR SEO SETTINGS
-- ============================================================

-- Atualizar ogImage
UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'https://prot.icevanisolamento.com.br', 'https://icevanisolamento.com.br')
WHERE ogImage LIKE '%https://prot.icevanisolamento.com.br%';

UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'http://prot.icevanisolamento.com.br', 'http://icevanisolamento.com.br')
WHERE ogImage LIKE '%http://prot.icevanisolamento.com.br%';

UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE ogImage LIKE '%prot.icevanisolamento.com.br%';

-- Atualizar metaTitulo
UPDATE seo_settings 
SET metaTitulo = REPLACE(metaTitulo, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE metaTitulo LIKE '%prot.icevanisolamento.com.br%';

-- Atualizar metaDescricao
UPDATE seo_settings 
SET metaDescricao = REPLACE(metaDescricao, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE metaDescricao LIKE '%prot.icevanisolamento.com.br%';

-- ============================================================
-- 3. ATUALIZAR BANNERS HERO
-- ============================================================

-- Atualizar titulo
UPDATE hero_banners 
SET titulo = REPLACE(titulo, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE titulo LIKE '%prot.icevanisolamento.com.br%';

-- Atualizar descricao
UPDATE hero_banners 
SET descricao = REPLACE(descricao, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE descricao LIKE '%prot.icevanisolamento.com.br%';

-- ============================================================
-- 4. VERIFICAÇÃO
-- ============================================================

-- Verificar se as reversões foram aplicadas
SELECT 
    'settings' as tabela,
    COUNT(*) as registros_com_dominio_original
FROM settings 
WHERE value LIKE '%icevanisolamento.com.br%'
  AND value NOT LIKE '%prot.icevanisolamento.com.br%'

UNION ALL

SELECT 
    'seo_settings' as tabela,
    COUNT(*) as registros_com_dominio_original
FROM seo_settings 
WHERE (ogImage LIKE '%icevanisolamento.com.br%' 
   OR metaTitulo LIKE '%icevanisolamento.com.br%' 
   OR metaDescricao LIKE '%icevanisolamento.com.br%')
  AND ogImage NOT LIKE '%prot.icevanisolamento.com.br%'
  AND metaTitulo NOT LIKE '%prot.icevanisolamento.com.br%'
  AND metaDescricao NOT LIKE '%prot.icevanisolamento.com.br%'

UNION ALL

SELECT 
    'hero_banners' as tabela,
    COUNT(*) as registros_com_dominio_original
FROM hero_banners 
WHERE (titulo LIKE '%icevanisolamento.com.br%' 
   OR descricao LIKE '%icevanisolamento.com.br%')
  AND titulo NOT LIKE '%prot.icevanisolamento.com.br%'
  AND descricao NOT LIKE '%prot.icevanisolamento.com.br%';

-- ============================================================
-- 5. VERIFICAR SE AINDA EXISTE DOMÍNIO PROT
-- ============================================================

-- Verificar se ainda há referências ao domínio prot (não deveria ter)
SELECT 
    'settings' as tabela,
    `key`,
    value
FROM settings 
WHERE value LIKE '%prot.icevanisolamento.com.br%'

UNION ALL

SELECT 
    'seo_settings' as tabela,
    pageSlug as `key`,
    CONCAT('ogImage: ', ogImage, ' | metaTitulo: ', metaTitulo) as value
FROM seo_settings 
WHERE ogImage LIKE '%prot.icevanisolamento.com.br%' 
   OR metaTitulo LIKE '%prot.icevanisolamento.com.br%' 
   OR metaDescricao LIKE '%prot.icevanisolamento.com.br%'

UNION ALL

SELECT 
    'hero_banners' as tabela,
    CAST(id AS CHAR) as `key`,
    CONCAT('titulo: ', titulo, ' | descricao: ', descricao) as value
FROM hero_banners 
WHERE titulo LIKE '%prot.icevanisolamento.com.br%' 
   OR descricao LIKE '%prot.icevanisolamento.com.br%';

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================

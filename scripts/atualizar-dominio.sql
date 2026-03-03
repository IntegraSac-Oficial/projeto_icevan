-- ============================================================
-- SCRIPT DE ATUALIZAÇÃO DE DOMÍNIO
-- De: icevans.com.br → icevanisolamento.com.br
-- ============================================================
-- Execute este script no banco de dados de produção após o deploy
-- ============================================================

-- 1. VERIFICAR REFERÊNCIAS AO DOMÍNIO ANTIGO
-- ============================================================

-- Verificar na tabela settings
SELECT 
    id, 
    `key`, 
    value 
FROM settings 
WHERE value LIKE '%icevans.com.br%';

-- Verificar na tabela seo_settings
SELECT 
    id, 
    pageSlug, 
    metaTitulo, 
    ogImage 
FROM seo_settings 
WHERE ogImage LIKE '%icevans.com.br%' 
   OR metaTitulo LIKE '%icevans.com.br%' 
   OR metaDescricao LIKE '%icevans.com.br%';

-- Verificar na tabela hero_banners
SELECT 
    id, 
    titulo, 
    descricao 
FROM hero_banners 
WHERE titulo LIKE '%icevans.com.br%' 
   OR descricao LIKE '%icevans.com.br%';

-- 2. ATUALIZAR REFERÊNCIAS (SE ENCONTRADAS)
-- ============================================================

-- Atualizar settings
UPDATE settings 
SET value = REPLACE(value, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE value LIKE '%icevans.com.br%';

-- Atualizar seo_settings - ogImage
UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE ogImage LIKE '%icevans.com.br%';

-- Atualizar seo_settings - metaTitulo
UPDATE seo_settings 
SET metaTitulo = REPLACE(metaTitulo, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE metaTitulo LIKE '%icevans.com.br%';

-- Atualizar seo_settings - metaDescricao
UPDATE seo_settings 
SET metaDescricao = REPLACE(metaDescricao, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE metaDescricao LIKE '%icevans.com.br%';

-- Atualizar hero_banners - titulo
UPDATE hero_banners 
SET titulo = REPLACE(titulo, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE titulo LIKE '%icevans.com.br%';

-- Atualizar hero_banners - descricao
UPDATE hero_banners 
SET descricao = REPLACE(descricao, 'icevans.com.br', 'icevanisolamento.com.br')
WHERE descricao LIKE '%icevans.com.br%';

-- 3. VERIFICAR EMAILS (OPCIONAL)
-- ============================================================
-- Se você também mudou o domínio do email, execute:

-- Verificar emails na tabela settings
SELECT 
    id, 
    `key`, 
    value 
FROM settings 
WHERE value LIKE '%@icevans.com.br%';

-- Atualizar emails (DESCOMENTE SE NECESSÁRIO)
-- UPDATE settings 
-- SET value = REPLACE(value, '@icevans.com.br', '@icevanisolamento.com.br')
-- WHERE value LIKE '%@icevans.com.br%';

-- 4. VERIFICAR RESULTADOS
-- ============================================================

-- Contar registros atualizados
SELECT 
    'settings' as tabela,
    COUNT(*) as registros_com_novo_dominio
FROM settings 
WHERE value LIKE '%icevanisolamento.com.br%'

UNION ALL

SELECT 
    'seo_settings' as tabela,
    COUNT(*) as registros_com_novo_dominio
FROM seo_settings 
WHERE ogImage LIKE '%icevanisolamento.com.br%' 
   OR metaTitulo LIKE '%icevanisolamento.com.br%' 
   OR metaDescricao LIKE '%icevanisolamento.com.br%'

UNION ALL

SELECT 
    'hero_banners' as tabela,
    COUNT(*) as registros_com_novo_dominio
FROM hero_banners 
WHERE titulo LIKE '%icevanisolamento.com.br%' 
   OR descricao LIKE '%icevanisolamento.com.br%';

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
-- IMPORTANTE: Faça backup do banco antes de executar!
-- ============================================================

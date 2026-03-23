-- ============================================================
-- CORREÇÃO: Remover duplicação de "prot" no domínio
-- De: prot.prot.icevanisolamento.com.br → prot.icevanisolamento.com.br
-- ============================================================

-- Corrigir settings
UPDATE settings 
SET value = REPLACE(value, 'prot.prot.icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE value LIKE '%prot.prot.icevanisolamento.com.br%';

-- Corrigir seo_settings
UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'prot.prot.icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE ogImage LIKE '%prot.prot.icevanisolamento.com.br%';

UPDATE seo_settings 
SET metaTitulo = REPLACE(metaTitulo, 'prot.prot.icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE metaTitulo LIKE '%prot.prot.icevanisolamento.com.br%';

UPDATE seo_settings 
SET metaDescricao = REPLACE(metaDescricao, 'prot.prot.icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE metaDescricao LIKE '%prot.prot.icevanisolamento.com.br%';

-- Corrigir hero_banners
UPDATE hero_banners 
SET titulo = REPLACE(titulo, 'prot.prot.icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE titulo LIKE '%prot.prot.icevanisolamento.com.br%';

UPDATE hero_banners 
SET descricao = REPLACE(descricao, 'prot.prot.icevanisolamento.com.br', 'prot.icevanisolamento.com.br')
WHERE descricao LIKE '%prot.prot.icevanisolamento.com.br%';

-- Verificação
SELECT 'settings' as tabela, `key`, value
FROM settings 
WHERE value LIKE '%prot.icevanisolamento.com.br%';

# Instruções para Reverter Domínio no Banco de Dados

## Situação Atual

✅ **Código já revertido** - Todos os arquivos de código já estão com `icevanisolamento.com.br`

⚠️ **Banco de dados precisa ser revertido** - Ainda pode ter `prot.icevanisolamento.com.br`

## Como Reverter o Banco de Dados

### Opção 1: Executar o Script SQL Manualmente

1. Abra seu cliente MySQL (MySQL Workbench, phpMyAdmin, ou linha de comando)

2. Conecte no banco de dados local:
   - Host: `localhost`
   - Porta: `3307`
   - Usuário: `root`
   - Senha: `icevans123`
   - Banco: `icevans`

3. Execute o arquivo: `scripts/reverter-dominio-original.sql`

   Ou copie e cole os comandos abaixo:

```sql
-- Reverter site_url
UPDATE settings 
SET value = 'https://icevanisolamento.com.br'
WHERE `key` = 'site_url';

-- Reverter settings (HTTPS)
UPDATE settings 
SET value = REPLACE(value, 'https://prot.icevanisolamento.com.br', 'https://icevanisolamento.com.br')
WHERE value LIKE '%https://prot.icevanisolamento.com.br%';

-- Reverter settings (HTTP)
UPDATE settings 
SET value = REPLACE(value, 'http://prot.icevanisolamento.com.br', 'http://icevanisolamento.com.br')
WHERE value LIKE '%http://prot.icevanisolamento.com.br%';

-- Reverter settings (sem protocolo)
UPDATE settings 
SET value = REPLACE(value, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE value LIKE '%prot.icevanisolamento.com.br%';

-- Reverter seo_settings ogImage (HTTPS)
UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'https://prot.icevanisolamento.com.br', 'https://icevanisolamento.com.br')
WHERE ogImage LIKE '%https://prot.icevanisolamento.com.br%';

-- Reverter seo_settings ogImage (HTTP)
UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'http://prot.icevanisolamento.com.br', 'http://icevanisolamento.com.br')
WHERE ogImage LIKE '%http://prot.icevanisolamento.com.br%';

-- Reverter seo_settings ogImage (sem protocolo)
UPDATE seo_settings 
SET ogImage = REPLACE(ogImage, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE ogImage LIKE '%prot.icevanisolamento.com.br%';

-- Reverter seo_settings metaTitulo
UPDATE seo_settings 
SET metaTitulo = REPLACE(metaTitulo, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE metaTitulo LIKE '%prot.icevanisolamento.com.br%';

-- Reverter seo_settings metaDescricao
UPDATE seo_settings 
SET metaDescricao = REPLACE(metaDescricao, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE metaDescricao LIKE '%prot.icevanisolamento.com.br%';

-- Reverter hero_banners titulo
UPDATE hero_banners 
SET titulo = REPLACE(titulo, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE titulo LIKE '%prot.icevanisolamento.com.br%';

-- Reverter hero_banners descricao
UPDATE hero_banners 
SET descricao = REPLACE(descricao, 'prot.icevanisolamento.com.br', 'icevanisolamento.com.br')
WHERE descricao LIKE '%prot.icevanisolamento.com.br%';
```

4. Verifique se funcionou:

```sql
-- Não deve retornar nenhum resultado
SELECT * FROM settings WHERE value LIKE '%prot.icevanisolamento.com.br%';
SELECT * FROM seo_settings WHERE ogImage LIKE '%prot.icevanisolamento.com.br%' 
   OR metaTitulo LIKE '%prot.icevanisolamento.com.br%' 
   OR metaDescricao LIKE '%prot.icevanisolamento.com.br%';
SELECT * FROM hero_banners WHERE titulo LIKE '%prot.icevanisolamento.com.br%' 
   OR descricao LIKE '%prot.icevanisolamento.com.br%';
```

### Opção 2: Linha de Comando MySQL

```bash
mysql -u root -p -P 3307 -h localhost icevans < scripts/reverter-dominio-original.sql
```

Senha: `icevans123`

## O Que Foi Mantido

✅ Todo o reposicionamento de isolamento térmico
✅ Todos os textos atualizados (sem refrigeração)
✅ Todas as aplicações reescritas
✅ SEO atualizado
✅ Banners atualizados

## O Que Foi Revertido

🔄 Apenas o domínio: `prot.icevanisolamento.com.br` → `icevanisolamento.com.br`

## Próximos Passos

Depois de executar o script SQL:

1. Reinicie o servidor Next.js (se estiver rodando)
2. Verifique o site localmente
3. Faça backup do banco de dados
4. Quando estiver pronto, faça o deploy no Coolify

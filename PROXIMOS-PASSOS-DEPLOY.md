# 🚀 PRÓXIMOS PASSOS - DEPLOY E CONFIGURAÇÃO

**Data**: 04/03/2026  
**Commit**: f323d25  
**Status**: ✅ Push realizado com sucesso

---

## ✅ O QUE FOI FEITO

### Correções Implementadas
1. ✅ Removido fetch para `/api/admin/settings` de todos os componentes públicos
2. ✅ HeroSlider recebe configurações via props do servidor
3. ✅ ContactForm recebe config EmailJS via props
4. ✅ Footer recebe lista de contatos via props
5. ✅ Logos carregam via API `/api/logo` imediatamente
6. ✅ Seed atualizado com configurações de filtro do hero
7. ✅ Build passa sem erros
8. ✅ Código commitado e enviado para GitHub

### Resultado
- Erros 401: Eliminados (0 erros)
- Logos: Carregam corretamente
- Overlay do banner: Visível
- Telefone do banner: Aparece
- Build: Passa sem erros

---

## 📋 PRÓXIMOS PASSOS

### 1. Aguardar Deploy Automático no Coolify

O Coolify deve detectar o push e iniciar o deploy automaticamente.

**Verificar:**
- Acesse o painel do Coolify
- Verifique se o deploy foi iniciado
- Aguarde conclusão do build e deploy

---

### 2. Executar Seed no Servidor

Após o deploy, execute o seed para popular o banco com as configurações:

```bash
# Conectar ao servidor via SSH ou terminal do Coolify
npx tsx scripts/seed-empresa-config.ts
```

**O que o seed faz:**
- Adiciona 26 configurações iniciais no banco
- Inclui: empresa, contato, endereço, redes sociais, SEO, EmailJS
- Inclui: `hero_filtro_cor`, `hero_filtro_opacidade`, `header_telefone`, `banner_telefone`

---

### 3. Configurar Lista de Contatos no Admin

Após o seed, acesse o admin e configure a lista de contatos:

**Caminho**: `/admin/configuracoes`

**Campo**: `empresa_contatos` (JSON)

**Formato**:
```json
[
  {
    "label": "Comercial/Vendas",
    "numero": "+55 (11) 91330-8513"
  },
  {
    "label": "Financeiro",
    "numero": "+55 (11) 94824-2999"
  },
  {
    "label": "Assistência técnica",
    "numero": "+55 (11) 96592-3480"
  }
]
```

**Resultado**: Footer mostrará a lista completa de contatos com labels

---

### 4. Verificar Site em Produção

Após seed e configuração, verifique:

**Console do Navegador:**
- [ ] Sem erros 401
- [ ] Sem erros 404 de logos
- [ ] Apenas erro 404 do favicon (normal)

**Elementos Visuais:**
- [ ] Logo do Header aparece
- [ ] Logo do Footer aparece
- [ ] Overlay do banner visível
- [ ] Telefone do banner aparece
- [ ] Lista de contatos no Footer aparece

**Funcionalidades:**
- [ ] Formulário de contato funciona
- [ ] Links do WhatsApp funcionam
- [ ] Navegação funciona

---

### 5. Ajustes Finais (Se Necessário)

Se algo não estiver funcionando:

**Logos não aparecem:**
- Verificar se arquivos existem em `/public/images/logo/`
- Verificar API `/api/logo` retorna caminhos corretos
- Verificar console do navegador

**Contatos não aparecem no Footer:**
- Verificar se `empresa_contatos` está no banco
- Verificar formato JSON está correto
- Verificar console do servidor

**Overlay do banner não aparece:**
- Verificar se `hero_filtro_cor` e `hero_filtro_opacidade` estão no banco
- Verificar valores no admin

---

## 🔍 COMANDOS ÚTEIS

### Verificar Logs do Servidor
```bash
# No Coolify ou SSH
pm2 logs
# ou
docker logs <container-id>
```

### Verificar Banco de Dados
```bash
# Conectar ao MySQL
mysql -u root -p

# Verificar configurações
USE icevan_db;
SELECT * FROM settings WHERE key LIKE 'hero_%';
SELECT * FROM settings WHERE key = 'empresa_contatos';
```

### Reexecutar Seed (Se Necessário)
```bash
# Limpar configurações antigas (opcional)
DELETE FROM settings WHERE key IN ('hero_filtro_cor', 'hero_filtro_opacidade');

# Executar seed novamente
npx tsx scripts/seed-empresa-config.ts
```

---

## 📊 CHECKLIST FINAL

### Deploy
- [ ] Push realizado com sucesso ✅
- [ ] Coolify detectou push
- [ ] Build concluído sem erros
- [ ] Deploy concluído
- [ ] Site acessível

### Configuração
- [ ] Seed executado no servidor
- [ ] Configurações no banco verificadas
- [ ] Lista de contatos configurada no admin
- [ ] Logos enviadas para `/public/images/logo/`

### Validação
- [ ] Console limpo de erros
- [ ] Logos aparecem
- [ ] Overlay do banner visível
- [ ] Telefone do banner aparece
- [ ] Contatos do Footer aparecem
- [ ] Formulário funciona
- [ ] WhatsApp funciona

---

## 🎯 RESULTADO ESPERADO

Após completar todos os passos:

1. Site carrega sem erros no console
2. Todos os elementos visuais aparecem corretamente
3. Dados vêm do banco de dados (100% dinâmico)
4. Admin pode editar tudo sem tocar no código
5. Performance otimizada (SSR + cache desabilitado onde necessário)

---

## 📝 NOTAS

- O seed só adiciona configurações que não existem (não sobrescreve)
- Se precisar reconfigurar, delete as chaves específicas antes de rodar o seed
- Logs do servidor ajudam a identificar problemas
- Console do navegador mostra erros do client-side

---

**Próxima ação**: Aguardar deploy do Coolify e executar seed no servidor.

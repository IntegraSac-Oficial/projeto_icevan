# 📋 Plano de Migração - Tudo Editável pelo Admin

**Data**: 04/03/2026  
**Objetivo**: Migrar todas as informações hardcoded para o banco de dados  
**Status**: 🟡 Planejamento

---

## 🎯 SITUAÇÃO ATUAL

Vejo que você já tem um **painel administrativo funcional** com várias seções:

✅ **Já Editável pelo Admin**:
- Banners Hero
- Galeria de Fotos
- Vídeos
- Contatos (formulário)
- Textos do Site (várias seções)
- Aplicações (Veículos)
- SEO
- Configurações da Empresa

✅ **Painel Admin Completo**:
- Dashboard
- Banners Hero
- Galeria
- Imagens
- Vídeos
- Veículos
- Contatos
- Textos do Site
- Aparência
- SEO
- Configurações

---

## 📊 ANÁLISE DO QUE JÁ ESTÁ NO BANCO

Vejo nas imagens do admin que você já tem:

### 1. Textos do Site ✅
- Nossas Soluções
- Por que Escolher
- Seção de Orçamento
- Aplicações
- Empresa
- Contato
- Footer

### 2. Configurações ✅
- Telefones do Site
- Informações da Empresa
- Endereço
- E-mail
- Horário de atendimento
- Copyright
- Rodapé (CNPJ)

### 3. Conteúdo Dinâmico ✅
- Banners Hero (carrossel)
- Galeria de fotos
- Vídeos
- Aplicações (veículos)

---

## 🔍 O QUE AINDA PODE ESTAR HARDCODED

Baseado nas imagens do site, vou verificar o que pode estar no código:

### 1. Cores e Estilos (CSS)
- Cores primárias, secundárias
- Fontes
- Espaçamentos

### 2. Textos Estáticos
- Títulos de seções
- Descrições
- Botões (textos)

### 3. Imagens Fixas
- Logo
- Ícones
- Imagens de fundo

### 4. Links e URLs
- Redes sociais
- WhatsApp
- Links externos

---

## 📝 PLANO DE AÇÃO

### Fase 1: Auditoria Completa (1-2 horas)
Vou analisar o código para identificar:
1. Todos os textos hardcoded
2. Todas as imagens fixas
3. Todos os links e URLs
4. Configurações de estilo

### Fase 2: Criar Tabelas Necessárias (30 min)
Se necessário, criar novas tabelas no banco:
- `appearance_settings` (cores, fontes, estilos)
- `social_links` (redes sociais)
- `static_content` (textos estáticos)

### Fase 3: Migrar Dados (2-3 horas)
1. Mover textos hardcoded para o banco
2. Mover URLs e links para o banco
3. Criar interface admin para editar

### Fase 4: Atualizar Componentes (2-3 horas)
1. Atualizar componentes para buscar do banco
2. Adicionar fallbacks (caso banco esteja vazio)
3. Testar todas as páginas

### Fase 5: Testes (1 hora)
1. Testar edição no admin
2. Verificar se reflete no site
3. Testar performance

---

## 🚀 PRÓXIMOS PASSOS

**Opção 1: Análise Completa**
Posso analisar todo o código e criar um relatório detalhado do que está hardcoded.

**Opção 2: Migração Gradual**
Posso começar migrando seção por seção (ex: começar pelo Header, depois Footer, etc.)

**Opção 3: Priorizar**
Você me diz quais seções são mais importantes e eu foco nelas primeiro.

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Vou verificar estes arquivos:
- [ ] `app/page.tsx` (Home)
- [ ] `app/layout.tsx` (Layout global)
- [ ] `components/Header.tsx`
- [ ] `components/Footer.tsx`
- [ ] `app/empresa/page.tsx`
- [ ] `app/contato/page.tsx`
- [ ] `app/aplicacoes/page.tsx`
- [ ] Todos os componentes em `components/`

---

## 💡 RECOMENDAÇÃO

Baseado no que vi, seu painel admin já está **muito completo**! 

Antes de começar a migração, sugiro:

1. **Fazer um backup completo** do código e banco
2. **Listar exatamente** o que você quer editar que ainda não consegue
3. **Priorizar** as mudanças mais importantes

---

## 🤔 PERGUNTAS PARA VOCÊ

1. **O que especificamente você quer editar** que ainda não consegue pelo admin?
2. **Cores e estilos** também devem ser editáveis?
3. **Logo e imagens fixas** devem ser editáveis?
4. **Textos dos botões** (ex: "Solicite um Orçamento") devem ser editáveis?
5. **Links de redes sociais** já são editáveis?

---

## 📊 ESTIMATIVA DE TEMPO

| Tarefa | Tempo Estimado |
|--------|----------------|
| Auditoria completa | 1-2 horas |
| Criar novas tabelas | 30 min |
| Migrar dados | 2-3 horas |
| Atualizar componentes | 2-3 horas |
| Testes | 1 hora |
| **TOTAL** | **7-10 horas** |

---

## 🎯 PRÓXIMA AÇÃO

Me diga:
1. Quer que eu faça a auditoria completa primeiro?
2. Ou prefere que eu comece migrando algo específico?
3. Tem alguma seção prioritária?

---

**Criado em**: 04/03/2026 às 02:30  
**Status**: Aguardando definição de prioridades

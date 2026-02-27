# Documentação Completa — Coolify, Infraestrutura e Melhorias do Painel

> Projeto: **Ice Van** — Site institucional + painel admin
> Stack: Next.js 14 · MySQL · Tailwind CSS · Prisma ORM
> Última atualização: 2026-02-26

---

## Índice

1. [Infraestrutura](#1-infraestrutura)
2. [Coolify — Configuração do Deploy](#2-coolify--configuração-do-deploy)
3. [Banco de Dados no Coolify](#3-banco-de-dados-no-coolify)
4. [phpMyAdmin no Coolify](#4-phpmyadmin-no-coolify)
5. [Cloudflare Tunnel](#5-cloudflare-tunnel)
6. [Correções de Build](#6-correções-de-build)
7. [Variáveis de Ambiente em Produção](#7-variáveis-de-ambiente-em-produção)
8. [Repositório GitHub — Limpeza e Boas Práticas](#8-repositório-github--limpeza-e-boas-práticas)
9. [Ambiente de Desenvolvimento Local](#9-ambiente-de-desenvolvimento-local)
10. [Melhorias do Painel Admin — Sessão Atual](#10-melhorias-do-painel-admin--sessão-atual)
11. [Problemas Encontrados e Soluções](#11-problemas-encontrados-e-soluções)
12. [Chave de Settings do Banco](#12-chave-de-settings-do-banco)
13. [Fluxo de Deploy Completo](#13-fluxo-de-deploy-completo)

---

## 1. Infraestrutura

### Visão Geral

```
Internet
  │
  ▼
Cloudflare (DNS + Tunnel)
  │  domínio: ice.integrasac.com.br
  │
  ▼
Cloudflare Tunnel (cloudflared) ─── aponta para ──▶ 192.168.100.218:9443
  │
  ▼
Servidor Proxmox (físico/dedicado)
  └── VM: Docker Swarm (IP: 192.168.100.218)
        ├── Portainer (gerenciamento de containers)
        ├── Traefik (Swarm) → porta 80/443
        ├── Coolify (self-hosted PaaS) → porta 8000
        │     ├── Traefik (Coolify) → porta 9080 (HTTP) / 9443 (HTTPS)
        │     ├── App Ice Van → container porta 3000
        │     ├── MySQL (Coolify) → container porta 3306
        │     └── phpMyAdmin → container
        └── Outros serviços Swarm
```

### Componentes

| Componente | Descrição | Acesso |
|------------|-----------|--------|
| **Proxmox** | Hypervisor físico — gerencia a VM | Rede interna |
| **Docker Swarm** | Orquestrador de containers na VM | 192.168.100.218 |
| **Portainer** | Interface gráfica para o Swarm | Via Swarm Traefik |
| **Coolify** | PaaS self-hosted (v4.0.0-beta.463) | `https://coolify.integrasac.com.br` |
| **Traefik (Coolify)** | Reverse proxy dos apps Coolify | porta 9080 / 9443 |
| **Cloudflare Tunnel** | Expõe o app para a internet sem IP público | — |

---

## 2. Coolify — Configuração do Deploy

### Tipo de Deploy

- **Plataforma:** Coolify v4.0.0-beta.463
- **Build system:** Nixpacks (detecta Next.js automaticamente)
- **Branch:** `main`
- **Repositório:** `https://github.com/IntegraSac-Oficial/projeto_icevan`

### Configurações do App no Coolify

| Campo | Valor |
|-------|-------|
| **Domínio** | `https://ice.integrasac.com.br` |
| **Porta do container** | `3000` |
| **Comando pós-deploy** | `npx prisma migrate deploy` |
| **Build system** | Nixpacks |

### Comando pós-deploy

O comando `npx prisma migrate deploy` é executado automaticamente após cada deploy bem-sucedido. Ele aplica todas as migrations pendentes na tabela `_prisma_migrations` do banco de dados de produção.

---

## 3. Banco de Dados no Coolify

### Configuração

- **Engine:** MySQL 8
- **UUID do serviço (Coolify):** `gsgcc8sgw0sooows4sw84s80`
- **Hostname interno (entre containers Coolify):** `gsgcc8sgw0sooows4sw84s80`
- **Porta:** `3306`
- **Database:** `icevans`
- **Usuário:** `root`

### DATABASE_URL em produção

```
mysql://root:SENHA_ROOT@gsgcc8sgw0sooows4sw84s80:3306/icevans
```

> ⚠️ O hostname é o UUID do serviço Coolify — funciona porque ambos os containers (app e banco) estão na mesma rede Docker gerenciada pelo Coolify.

### Como o banco foi criado

1. No Coolify → "Databases" → "New Database" → MySQL
2. Coolify cria o container MySQL automaticamente
3. O banco `icevans` foi criado manualmente via SQL
4. A `DATABASE_URL` foi configurada nas variáveis de ambiente do app no Coolify

### Migrations

As migrations são aplicadas automaticamente no post-deploy via:
```bash
npx prisma migrate deploy
```

Migrations existentes (em ordem):

| Migration | Tabelas criadas |
|-----------|----------------|
| `20260220123225_init` | `contacts`, `seo_settings`, `gallery_photos`, `videos` |
| `20260220124920_add_settings` | `settings` |
| `20260220190241_add_hero_banners` | `hero_banners` |
| `20260223131639_add_users_table` | `users` |

---

## 4. phpMyAdmin no Coolify

### Finalidade

Interface web para gerenciar o banco de dados MySQL de produção diretamente no Coolify, sem expor o banco publicamente.

### Configuração (docker-compose.yml)

```yaml
services:
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      PMA_HOST: gsgcc8sgw0sooows4sw84s80   # UUID do MySQL no Coolify
      PMA_PORT: 3306
      PMA_USER: root
      PMA_PASSWORD: SENHA_ROOT_AQUI
    ports:
      - "8080:80"
```

> O `PMA_HOST` deve ser o UUID do container MySQL do Coolify (visível na aba de configuração do banco).

### Acesso

O phpMyAdmin fica acessível pelo domínio gerado automaticamente pelo Coolify (ex: `https://xxxx.sslip.io` — apenas na rede interna ou via VPN).

### Problemas resolvidos

- **Access denied (using password: NO):** `PMA_PASSWORD` não estava definido → adicionado via env vars do Coolify
- **DNS resolution failure:** phpMyAdmin não estava na mesma rede Docker do MySQL → resolvido usando o UUID como `PMA_HOST` e habilitando `connect_to_docker_network: true` via API do Coolify
- **#1044 Access denied para GRANT:** usuário `mysql` não tinha permissão de GRANT → trocado para `root`

---

## 5. Cloudflare Tunnel

### Configuração

O Cloudflare Tunnel substitui a necessidade de IP público no servidor.

| Campo | Valor |
|-------|-------|
| **Domínio público** | `ice.integrasac.com.br` |
| **Serviço (destino)** | `https://192.168.100.218:9443` |
| **Path filter** | Nenhum (rota todos os caminhos) |
| **TLS Verification** | Desabilitado (certificado self-signed do Traefik Coolify) |

### Por que porta 9443?

- Porta `9443` = Traefik do Coolify em modo **HTTPS**
- Usar HTTP (9080) causava loop de redirecionamento: Cloudflare envia HTTPS → Traefik redireciona HTTP→HTTPS → loop infinito
- Apontar direto para HTTPS no Traefik do Coolify resolve o loop

### Problemas resolvidos

| Problema | Causa | Solução |
|----------|-------|---------|
| `ERR_NAME_NOT_RESOLVED` | Domínio sslip.io não resolve IPs privados | Usar domínio próprio com Cloudflare Tunnel |
| `ERR_TOO_MANY_REDIRECTS` | HTTP→HTTPS loop | Apontar Cloudflare para `https://192.168.100.218:9443` |
| Path filter `^/blog` | Tunnel só roteava `/blog*` | Remover o path filter no dashboard Cloudflare |

---

## 6. Correções de Build

### Problema: Nixpacks cache mount em arquivo (não diretório)

**Erro:**
```
failed to solve: lstat /var/lib/docker/tmp/.../tsconfig.tsbuildinfo:
not a directory
```

**Causa:** O Nixpacks tentava montar um volume de cache no caminho `tsconfig.tsbuildinfo`, que é um **arquivo**, não um diretório. O Docker/BuildKit não suporta cache mounts em caminhos de arquivo.

**Solução:**

1. Desabilitar o modo incremental no TypeScript:

```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": false,   // ← era true
    ...
  }
}
```

2. Adicionar ao `.gitignore`:
```
tsconfig.tsbuildinfo
```

3. Remover do tracking do git:
```bash
git rm --cached tsconfig.tsbuildinfo
```

---

## 7. Variáveis de Ambiente em Produção

Configuradas nas variáveis de ambiente do app no Coolify:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | `mysql://root:SENHA@gsgcc8sgw0sooows4sw84s80:3306/icevans` |
| `ADMIN_EMAIL` | E-mail de acesso inicial ao painel admin |
| `ADMIN_PASSWORD` | Senha de acesso inicial ao painel admin |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT (mínimo 32 chars) |

> ⚠️ **Nunca commite** o arquivo `.env.local` — ele contém credenciais reais e está no `.gitignore`.

### Variáveis locais (.env.local)

```env
DATABASE_URL="mysql://root:icevans123@localhost:3307/icevans"
ADMIN_EMAIL="admin@icevans.com.br"
ADMIN_PASSWORD="icevans@admin2025"
JWT_SECRET="icevans-jwt-secret-mude-em-producao-32chars"
```

> O servidor MySQL local roda na **porta 3307** (não 3306) para evitar conflito com MySQL local do sistema.

---

## 8. Repositório GitHub — Limpeza e Boas Práticas

### Problema encontrado

O repositório tinha arquivos sensíveis e de build commitados:
- `.env.local` — continha senhas reais
- Pasta `.next/` — build output (centenas de arquivos binários)

### Solução aplicada

```bash
# Remover do tracking git (mantém os arquivos localmente)
git rm --cached .env.local
git rm -r --cached .next/

# Restaurar .mcp.json (tinha token do Coolify em texto puro — não deve ir ao GitHub)
git checkout -- .mcp.json

# Atualizar .gitignore
```

### .gitignore atual

```gitignore
node_modules

# Environment variables — never commit real credentials
.env
.env.local
.env*.local

# Next.js build output
.next/
out/

/lib/generated/prisma
tsconfig.tsbuildinfo
```

> ⚠️ O arquivo `.mcp.json` local contém o token do Coolify (`COOLIFY_ACCESS_TOKEN`). Ele está sendo rastreado pelo git com a versão **sem token**. Nunca commite a versão com token.

---

## 9. Ambiente de Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- Docker Desktop
- MySQL rodando na porta 3307

### Container MySQL local

```bash
docker run -d \
  --name ice_van_mysql \
  -e MYSQL_ROOT_PASSWORD=icevans123 \
  -e MYSQL_DATABASE=icevans \
  -p 3307:3306 \
  mysql:8
```

### Inicializar o projeto

```bash
# 1. Instalar dependências (necessário após clonar ou se node_modules não existir)
npm install

# 2. Aplicar migrations do Prisma
npx prisma migrate deploy

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

O site fica em: `http://localhost:3000`
O painel admin: `http://localhost:3000/admin`

---

## 10. Melhorias do Painel Admin — Sessão Atual

### 10.1 Painel de Configurações — Nova Aba "Empresa"

**Arquivo:** `app/admin/configuracoes/page.tsx`

Adicionada nova aba entre "Aparência" e "SMTP" com campos para editar os textos do rodapé do site:

| Campo no admin | Chave no banco | Onde aparece no site |
|----------------|----------------|----------------------|
| Descrição da empresa | `empresa_descricao` | Abaixo da logo no rodapé |
| Endereço completo | `empresa_endereco` | Coluna Contato do rodapé |
| Telefone | `empresa_telefone` | Coluna Contato do rodapé |
| E-mail de contato | `empresa_email` | Coluna Contato do rodapé |
| Horário de atendimento | `empresa_horario` | Coluna Contato do rodapé |
| Texto de copyright | `footer_copyright` | Barra inferior — esquerda |
| Texto do rodapé | `footer_rodape` | Barra inferior — direita |

### 10.2 Footer dinâmico

**Arquivo:** `components/Footer.tsx`

O Footer agora busca os textos do banco de dados ao carregar (`/api/admin/settings`). Se a chave não existir no banco, usa os valores do `lib/config.ts` como fallback.

```typescript
// Estado com fallbacks do lib/config.ts
const [textos, setTextos] = useState({
  descricao:       empresa.descricao,
  endereco:        empresa.enderecoCompleto,
  telefone:        empresa.telefone,
  email:           empresa.email,
  horario:         empresa.horario,
  footerCopyright: `© ${new Date().getFullYear()} ${empresa.nome}. Todos os direitos reservados.`,
  footerRodape:    "CNPJ — Refrigeração para Transporte | São Paulo, SP",
});

// Busca do banco na montagem do componente
useEffect(() => {
  fetch("/api/admin/settings")
    .then(r => r.json())
    .then(data => setTextos(prev => ({
      descricao:       data.empresa_descricao  || prev.descricao,
      // ... outros campos
    })));
}, []);
```

### 10.3 Painel de Configurações — Filtro de Cor do Banner

**Arquivo:** `app/admin/configuracoes/page.tsx` (aba Aparência)

Adicionado card "Filtro de Cor do Banner" na aba Aparência com:

- **Color picker** — escolha da cor do filtro (hex)
- **Slider de intensidade** — de 0% (invisível) a 80% (intenso)
- **Preview em tempo real** — visualização da cor + opacidade sobre um gradiente representativo

| Chave no banco | Padrão | Descrição |
|----------------|--------|-----------|
| `hero_filtro_cor` | `#2563EB` | Cor hex do filtro |
| `hero_filtro_opacidade` | `20` | Intensidade em % (0–80) |

### 10.4 HeroSlider com filtro dinâmico

**Arquivo:** `components/HeroSlider.tsx`

O filtro de cor do banner deixou de ser hardcoded (`bg-blue-600/20`) e passou a ser controlado pelo banco de dados:

```typescript
// Antes (hardcoded):
<div className="absolute inset-0 bg-blue-600/20" />

// Depois (dinâmico):
<div
  className="absolute inset-0"
  style={{ backgroundColor: filtroCor, opacity: filtroOpacidade / 100 }}
/>
```

O componente busca `hero_filtro_cor` e `hero_filtro_opacidade` na API de settings ao montar, com fallback para os valores padrão.

### 10.5 HeroSlider — Ajustes de Layout Mobile

**Arquivo:** `components/HeroSlider.tsx`

Melhorias no layout do hero para telas mobile (< `sm`):

| Elemento | Antes | Depois |
|----------|-------|--------|
| Alinhamento vertical do conteúdo | `items-center` (centro) | `items-end pb-14` (fundo) |
| Título `h1` | `text-3xl` | `text-2xl` |
| Subtítulo `p` | `text-lg`, `mb-8` | `text-sm`, `mb-5` |
| Botões — texto | `text-lg` | `text-sm` |
| Botões — padding | `px-8 py-4` | `px-5 py-2.5` |
| Botões — ícones | `w-5 h-5` | `w-4 h-4` |
| Largura dos botões | Full-width (esticado) | Auto (tamanho do conteúdo) |

**Técnica usada:** `items-start` no container `flex-col` dos botões evita que os botões se estiquem para a largura total no mobile.

No `sm:` em diante, todos os tamanhos voltam ao padrão original (desktop).

---

## 11. Problemas Encontrados e Soluções

### Tabela de problemas resolvidos nesta sessão

| # | Problema | Causa | Solução |
|---|----------|-------|---------|
| 1 | Build falha no Coolify (cache mount) | `tsconfig.tsbuildinfo` é arquivo, não diretório | `"incremental": false` no tsconfig + remover do git |
| 2 | Site inacessível — ERR_NAME_NOT_RESOLVED | sslip.io não resolve IPs privados | Cloudflare Tunnel com domínio próprio |
| 3 | ERR_TOO_MANY_REDIRECTS | HTTP→HTTPS loop entre Cloudflare e Traefik | Cloudflare aponta para `https://IP:9443` |
| 4 | 500 — banco de dados inacessível | `.env.local` não vai para produção | Configurar `DATABASE_URL` nas env vars do Coolify |
| 5 | phpMyAdmin — Access denied (no password) | `PMA_PASSWORD` não definido | Adicionar `PMA_PASSWORD` nas env vars |
| 6 | phpMyAdmin — DNS resolution failure | Container não na mesma rede Docker | Usar UUID do MySQL como `PMA_HOST` |
| 7 | Importação SQL — Table already exists | Migrations criaram tabelas antes da importação | Executar `DROP TABLE IF EXISTS` antes de importar |
| 8 | #1044 GRANT denied | Usuário `mysql` sem permissão de GRANT | Trocar para usuário `root` |
| 9 | App 500 após importação | `DATABASE_URL` usava usuário `mysql` sem permissão | Trocar `DATABASE_URL` para usuário `root` |
| 10 | `.env.local` e `.next/` no GitHub | Não estavam no `.gitignore` | Adicionar ao `.gitignore` + `git rm --cached` |
| 11 | Token Coolify no `.mcp.json` | `.mcp.json` com configuração sensível commitável | Restaurar versão sem token antes do push |

---

## 12. Chave de Settings do Banco

Todas as configurações dinâmicas do site são armazenadas na tabela `settings` (chave/valor).

### Lista completa de chaves

| Chave | Descrição | Padrão |
|-------|-----------|--------|
| `admin_email` | E-mail de acesso ao painel | (env `ADMIN_EMAIL`) |
| `admin_password` | Senha de acesso ao painel | (env `ADMIN_PASSWORD`) |
| `cor_primaria` | Cor primária (azul escuro) | `#003957` |
| `cor_secundaria` | Cor secundária (azul claro) | `#2D92BE` |
| `cor_destaque` | Cor de destaque / CTAs | `#F28C28` |
| `cor_neutra` | Cor neutra / fundos claros | `#F5F5F5` |
| `cor_texto` | Cor do texto principal | `#1A1A1A` |
| `smtp_host` | Servidor SMTP | — |
| `smtp_port` | Porta SMTP | `587` |
| `smtp_user` | Usuário SMTP | — |
| `smtp_pass` | Senha SMTP | — |
| `smtp_from` | E-mail remetente | — |
| `smtp_nome` | Nome do remetente | — |
| `hero_filtro_cor` | Cor do filtro do banner hero | `#2563EB` |
| `hero_filtro_opacidade` | Intensidade do filtro (0–80) | `20` |
| `empresa_descricao` | Descrição abaixo da logo no rodapé | (lib/config.ts) |
| `empresa_endereco` | Endereço completo no rodapé | (lib/config.ts) |
| `empresa_telefone` | Telefone no rodapé | (lib/config.ts) |
| `empresa_email` | E-mail de contato no rodapé | (lib/config.ts) |
| `empresa_horario` | Horário de atendimento no rodapé | (lib/config.ts) |
| `footer_copyright` | Texto copyright (barra inferior esquerda) | Gerado automaticamente |
| `footer_rodape` | Texto rodapé (barra inferior direita) | "CNPJ — Refrigeração..." |

---

## 13. Fluxo de Deploy Completo

### Como fazer um novo deploy

```
1. Fazer alterações no código localmente
2. Testar: npm run dev (http://localhost:3000)
3. git add <arquivos-específicos>
4. git commit -m "descrição da mudança"
5. git push origin main
```

O Coolify detecta o push no GitHub (webhook) e inicia automaticamente:

```
GitHub push
  │
  ▼
Coolify detecta (webhook)
  │
  ▼
Nixpacks faz o build (npm install + npm run build)
  │
  ▼
Container é substituído (zero-downtime)
  │
  ▼
Post-deploy: npx prisma migrate deploy
  │
  ▼
App disponível em https://ice.integrasac.com.br
```

### Verificar status do deploy

Acesse o Coolify em `https://coolify.integrasac.com.br` e verifique os logs do deploy.

### Verificar banco de dados

Acesse o phpMyAdmin via Coolify para inspecionar/editar o banco de produção.

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Coolify** | PaaS self-hosted — gerencia containers, builds e deploys |
| **Nixpacks** | Build system que detecta automaticamente a linguagem/framework |
| **Traefik** | Reverse proxy — roteia requisições para os containers corretos |
| **Cloudflare Tunnel** | Túnel seguro que expõe serviços internos para a internet |
| **sslip.io** | Serviço DNS wildcard — não resolve IPs privados (192.168.x.x) |
| **Docker Swarm** | Orquestrador de containers (modo nativo do Docker) |
| **Portainer** | Interface gráfica para gerenciar Docker Swarm |
| **Proxmox** | Hypervisor para VMs — hospeda a VM do Docker Swarm |
| **Prisma ORM** | ORM TypeScript para MySQL — migrations e queries type-safe |

---

*Documentação criada em 2026-02-26 cobrindo toda a sessão de configuração e melhorias do projeto Ice Van.*

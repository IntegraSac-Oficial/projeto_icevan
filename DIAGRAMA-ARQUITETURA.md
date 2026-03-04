# 🏗️ Diagrama da Arquitetura - Ice Van

**Como o site funciona (ou deveria funcionar)**

---

## 📊 ARQUITETURA ATUAL (90% Pronta)

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
│                                                                   │
│  Usuário digita: https://icevanisolamento.com.br                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ DNS resolve para Cloudflare
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE                                  │
│                                                                   │
│  ┌─────────────┐      ┌──────────────┐                          │
│  │     DNS     │      │     CDN      │                          │
│  │   Records   │      │   + Proxy    │                          │
│  └─────────────┘      └──────────────┘                          │
│                                                                   │
│  ⚠️  FALTA: Cloudflare Tunnel                                   │
│      (Túnel seguro para o servidor)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ ❌ SEM TÚNEL = SEM CONEXÃO
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SERVIDOR (192.168.100.218)                      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    TRAEFIK (Proxy Reverso)                │  │
│  │                                                            │  │
│  │  Porta 9080 (HTTP)  │  Porta 9443 (HTTPS)                │  │
│  │         ✅                    ✅                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ Roteia para aplicação             │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              APLICAÇÃO NEXT.JS                            │  │
│  │                                                            │  │
│  │  Container: zc4gck0k4wgkksk00scgo8cc-012316639698        │  │
│  │  Porta: 3000                                              │  │
│  │  Status: ✅ Running (Ready in 688ms)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ Conecta ao banco                  │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              MYSQL DATABASE                               │  │
│  │                                                            │  │
│  │  Container: j8wk008wo8448g88kgkw0os0                     │  │
│  │  Database: default                                        │  │
│  │  Porta: 3306                                              │  │
│  │  Status: ✅ running:healthy                              │  │
│  │  Tabelas: 8 criadas ✅                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 ARQUITETURA COMPLETA (Após Configurar Tunnel)

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
│                                                                   │
│  Usuário digita: https://icevanisolamento.com.br                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ DNS resolve para Cloudflare
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE                                  │
│                                                                   │
│  ┌─────────────┐      ┌──────────────┐      ┌────────────────┐ │
│  │     DNS     │      │     CDN      │      │  Cloudflare    │ │
│  │   Records   │ ───▶ │   + Proxy    │ ───▶ │    Tunnel      │ │
│  └─────────────┘      └──────────────┘      └────────────────┘ │
│                                                      │            │
│  ✅ Tunnel: icevan-production                       │            │
│     Protocolo: HTTPS                                 │            │
│     Criptografado: TLS                               │            │
└──────────────────────────────────────────────────────┼───────────┘
                                                        │
                              Túnel seguro (criptografado)
                                                        │
                                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SERVIDOR (192.168.100.218)                      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              CLOUDFLARED (Cliente do Tunnel)              │  │
│  │                                                            │  │
│  │  Serviço: cloudflared                                     │  │
│  │  Status: ✅ active (running)                             │  │
│  │  Conecta: Cloudflare ↔ Traefik                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ Encaminha para Traefik            │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    TRAEFIK (Proxy Reverso)                │  │
│  │                                                            │  │
│  │  Porta 9080 (HTTP)  │  Porta 9443 (HTTPS)                │  │
│  │         ✅                    ✅                           │  │
│  │                                                            │  │
│  │  Roteamento: icevanisolamento.com.br → App Next.js       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ Roteia para aplicação             │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              APLICAÇÃO NEXT.JS                            │  │
│  │                                                            │  │
│  │  Container: zc4gck0k4wgkksk00scgo8cc-012316639698        │  │
│  │  Porta: 3000                                              │  │
│  │  Status: ✅ Running (Ready in 688ms)                     │  │
│  │  DATABASE_URL: ✅ Correta                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ Conecta ao banco                  │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              MYSQL DATABASE                               │  │
│  │                                                            │  │
│  │  Container: j8wk008wo8448g88kgkw0os0                     │  │
│  │  Database: default                                        │  │
│  │  Porta: 3306                                              │  │
│  │  Status: ✅ running:healthy                              │  │
│  │  Tabelas: 8 criadas ✅                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE UMA REQUISIÇÃO (Após Tunnel)

```
1. Usuário acessa: https://icevanisolamento.com.br
                              │
                              ▼
2. DNS resolve para Cloudflare (IPs do Cloudflare)
                              │
                              ▼
3. Cloudflare recebe a requisição
   - Verifica cache (CDN)
   - Aplica regras de segurança (WAF)
   - Aplica SSL/TLS
                              │
                              ▼
4. Cloudflare Tunnel encaminha para o servidor
   - Conexão criptografada (TLS)
   - Não expõe IP do servidor
                              │
                              ▼
5. cloudflared (no servidor) recebe
   - Descriptografa
   - Encaminha para Traefik (porta 9443)
                              │
                              ▼
6. Traefik roteia para a aplicação
   - Verifica Host header
   - Encaminha para container Next.js (porta 3000)
                              │
                              ▼
7. Next.js processa a requisição
   - Renderiza página
   - Consulta banco de dados (se necessário)
   - Retorna HTML/JSON
                              │
                              ▼
8. Resposta volta pelo mesmo caminho
   Next.js → Traefik → cloudflared → Cloudflare → Usuário
```

---

## 🔐 CAMADAS DE SEGURANÇA

```
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA 1: Cloudflare                                            │
│  ✅ Proteção DDoS                                                │
│  ✅ WAF (Web Application Firewall)                               │
│  ✅ SSL/TLS (Certificado válido)                                 │
│  ✅ Cache CDN (Performance)                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA 2: Cloudflare Tunnel                                     │
│  ✅ Conexão criptografada (TLS)                                  │
│  ✅ Não expõe IP do servidor                                     │
│  ✅ Não precisa abrir portas no firewall                         │
│  ✅ Autenticação via token                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA 3: Traefik                                               │
│  ✅ Proxy reverso                                                │
│  ✅ Roteamento por domínio                                       │
│  ✅ SSL/TLS interno                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA 4: Aplicação Next.js                                     │
│  ✅ Autenticação JWT                                             │
│  ✅ Validação de dados                                           │
│  ✅ Sanitização de inputs                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA 5: Banco de Dados                                        │
│  ✅ Acesso apenas via rede interna                               │
│  ✅ Credenciais fortes                                           │
│  ✅ Backup automático                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 COMPARAÇÃO: Antes vs Depois

### ANTES (Sem Tunnel) ❌
```
Internet → ❌ SEM CONEXÃO ❌ → Servidor
```
**Resultado**: Site não acessível ("no available server")

### DEPOIS (Com Tunnel) ✅
```
Internet → Cloudflare → Tunnel → Servidor → Site
```
**Resultado**: Site acessível e seguro! 🎉

---

## 🎯 POR QUE CLOUDFLARE TUNNEL?

### Alternativa 1: Port Forwarding (NÃO RECOMENDADO)
```
Internet → Roteador (portas 80/443) → Servidor
```
**Problemas:**
- ❌ Expõe IP público do servidor
- ❌ Vulnerável a ataques DDoS
- ❌ Precisa configurar SSL manualmente
- ❌ Sem proteção WAF

### Alternativa 2: Cloudflare Tunnel (RECOMENDADO) ✅
```
Internet → Cloudflare → Tunnel (criptografado) → Servidor
```
**Vantagens:**
- ✅ IP do servidor fica oculto
- ✅ Proteção DDoS automática
- ✅ SSL automático
- ✅ WAF incluído
- ✅ Gratuito

---

## 📝 RESUMO VISUAL

```
┌──────────────────────────────────────────────────────────────┐
│                    SITUAÇÃO ATUAL                             │
│                                                               │
│  ✅ Aplicação: Funcionando                                   │
│  ✅ Banco de Dados: Funcionando                              │
│  ✅ Traefik: Funcionando                                     │
│  ❌ Cloudflare Tunnel: FALTA CONFIGURAR                     │
│  ❌ Site na Internet: NÃO ACESSÍVEL                         │
│                                                               │
│  Status: 90% Pronto                                          │
│  Falta: 10% (Cloudflare Tunnel)                             │
│  Tempo: ~15 minutos                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 PRÓXIMA AÇÃO

**Configurar Cloudflare Tunnel**

Siga o guia: `GUIA-CLOUDFLARE-TUNNEL.md`

Ou use os comandos prontos: `COMANDOS-PRONTOS.md`

---

**Criado em**: 04/03/2026  
**Versão**: 1.0

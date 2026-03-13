# 🚀 Guia de Deployment - Ice Van Site

## ✅ Correções Implementadas

### Problemas Resolvidos:
1. **Missing .dockerignore** - Criado arquivo para otimizar build do Docker
2. **Prisma client path issues** - Corrigido caminho de geração no Dockerfile
3. **Build dependencies** - Incluídas devDependencies necessárias para build
4. **Directory creation timing** - Melhorada ordem de criação de diretórios
5. **Health checks** - Implementado sistema de monitoramento de saúde
6. **Environment validation** - Criado script de validação de variáveis
7. **Build optimization** - Melhoradas configurações do Next.js

## 🔧 Pré-requisitos

1. **Variáveis de Ambiente** (arquivo `.env`):
```bash
# Database
DATABASE_URL="mysql://user:password@host:3306/database"

# Auth
NEXTAUTH_SECRET="your-secret-key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"

# SMTP (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yoursite.com"
```

## 🚀 Comandos de Deployment

### 1. Verificação Pré-Deployment
```bash
npm run deployment-check
```

### 2. Build e Deploy com Docker
```bash
# Build da imagem
npm run docker:build

# Executar container
npm run docker:run

# Ver logs
npm run docker:logs
```

### 3. Deploy com Docker Compose (Recomendado)
```bash
# Build e start completo (app + database)
docker-compose up --build

# Em background
docker-compose up --build -d

# Ver logs
docker-compose logs -f
```

## 🔍 Monitoramento

### Health Check
- **URL**: `http://localhost:3000/api/health`
- **Intervalo**: 30 segundos
- **Timeout**: 10 segundos
- **Retries**: 3 tentativas

### Logs de Container
```bash
# Ver logs em tempo real
docker-compose logs -f app

# Ver logs específicos
docker logs <container-id>
```

## 🛠️ Troubleshooting

### Erro de Build
```bash
# Limpar cache e rebuild
docker system prune -f
npm run docker:build
```

### Erro de Database
```bash
# Verificar conexão
npm run validate-env

# Regenerar Prisma client
npx prisma generate
```

### Erro de Permissões
```bash
# Verificar se o usuário nextjs tem permissões
docker exec -it <container> ls -la /app
```

## 📊 Estrutura de Arquivos Criados/Modificados

```
├── .dockerignore              # Otimização do build Docker
├── Dockerfile                 # Configuração robusta do container
├── docker-compose.yml         # Orquestração completa
├── healthcheck.js             # Script de health check
├── next.config.mjs            # Configurações otimizadas
├── package.json               # Novos scripts de deployment
├── app/api/health/route.ts    # Endpoint de saúde
└── scripts/
    ├── validate-env.js        # Validação de variáveis
    └── deployment-check.js    # Verificação pré-deployment
```

## 🎯 Próximos Passos

1. **Execute a verificação**: `npm run deployment-check`
2. **Configure as variáveis de ambiente** no arquivo `.env`
3. **Faça o deployment**: `docker-compose up --build`
4. **Monitore a saúde**: Acesse `http://localhost:3000/api/health`

## 🔒 Segurança

- Container executa com usuário não-root (`nextjs`)
- Variáveis sensíveis isoladas em `.env`
- Health checks para detecção precoce de problemas
- Build otimizado com remoção de devDependencies

## 📈 Performance

- Build em múltiplas etapas para otimização
- Cache de dependências do Docker
- Compressão de assets habilitada
- Output standalone para menor footprint
# Deploy Automático via FTP

Este projeto usa GitHub Actions para fazer deploy automático via FTP sempre que há push na branch `main`.

## Otimizações Implementadas

1. **Cache de dependências**: npm cache é usado para acelerar instalação
2. **Deploy seletivo**: Apenas arquivos necessários são enviados (.next, public, configs)
3. **Telemetria desabilitada**: Next.js telemetry desabilitado para build mais rápido
4. **Instalação otimizada**: `--prefer-offline --no-audit` para npm ci mais rápido

## Estrutura de Deploy

O workflow cria um pacote de deploy contendo apenas:
- `.next/` - Build do Next.js
- `public/` - Arquivos estáticos
- `package.json` e `package-lock.json` - Para instalação no servidor
- `next.config.mjs` - Configuração do Next.js
- `prisma/` - Schema do banco de dados

## Secrets Necessários

Configure no GitHub (Settings > Secrets and variables > Actions):

- `FTP_HOST` - Endereço do servidor FTP
- `FTP_USER` - Usuário FTP
- `FTP_PASS` - Senha FTP
- `DATABASE_URL` - URL de conexão com o banco de dados

## Tempo Estimado

- Build: ~1-2 minutos
- Deploy FTP: ~2-3 minutos
- **Total: ~3-5 minutos**

## Troubleshooting

### Erro de permissão no FTP
Se aparecer erro `550 Permission denied`, verifique:
1. Permissões da pasta no servidor (755 ou 775)
2. Se o usuário FTP tem permissão de escrita
3. Se o `server-dir` está correto

### Build falha
1. Verifique se todos os secrets estão configurados
2. Rode `npm run build` localmente para testar
3. Verifique logs no GitHub Actions

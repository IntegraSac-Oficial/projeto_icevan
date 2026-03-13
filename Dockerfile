# Use a imagem base do Node.js (Debian-based para melhor compatibilidade com Prisma)
FROM node:22-slim

# Instalar dependências do sistema necessárias
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar scripts necessários para o build
COPY scripts ./scripts/

# Criar diretórios de imagens necessários
RUN mkdir -p /app/public/images/logo \
    && mkdir -p /app/public/images/hero \
    && mkdir -p /app/public/images/aplicacoes \
    && mkdir -p /app/public/images/empresa \
    && mkdir -p /app/public/images/galeria \
    && mkdir -p /app/public/images/formas-pagamento

# Copiar código da aplicação
COPY . .

# Gerar Prisma client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Remover devDependencies após o build para reduzir tamanho da imagem
RUN npm prune --production

# Criar usuário não-root para segurança
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copiar arquivos necessários para standalone
RUN cp -r .next/standalone ./
RUN cp -r .next/static ./.next/standalone/.next/
RUN cp -r public ./.next/standalone/

# Alterar propriedade dos arquivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor porta
EXPOSE 3000

# Variável de ambiente para produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando para iniciar a aplicação
CMD ["node", ".next/standalone/server.js"]
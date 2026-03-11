# Use a imagem base do Node.js
FROM node:22-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar diretórios de imagens necessários
RUN mkdir -p /app/public/images/logo \
    && mkdir -p /app/public/images/hero \
    && mkdir -p /app/public/images/aplicacoes \
    && mkdir -p /app/public/images/empresa \
    && mkdir -p /app/public/images/galeria \
    && mkdir -p /app/public/images/formas-pagamento

# Gerar Prisma client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
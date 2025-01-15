# Estágio de build
FROM node:18.17.1-alpine3.18 AS builder

# Configurações de ambiente
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT=5173
ENV HOST=0.0.0.0

# Configura diretório de trabalho
WORKDIR /app

# Instala dependências de build
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# Copia arquivos de configuração
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci --only=production

# Copia o restante do código
COPY . .

# Build da aplicação
RUN npm run build

# Estágio final
FROM node:18.17.1-alpine3.18

# Configurações de segurança
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Configura usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Configura diretório de trabalho
WORKDIR /app

# Copia arquivos do estágio de build
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/public ./public

# Configura health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5173 || exit 1

# Expõe a porta
EXPOSE 5173

# Comando de execução
CMD ["node", "dist/main.js"]

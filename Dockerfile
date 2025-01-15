# ---- Estágio de Build ----
FROM node:18.17.1-alpine3.18 AS builder

# Configuração de argumentos e variáveis de ambiente
ARG PORT=5173
ENV PORT=${PORT} \
    HOST=0.0.0.0 \
    NODE_ENV=development

WORKDIR /app

# Instalação de dependências do sistema
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copia arquivos de configuração
COPY package*.json .
COPY vite.config.js .
COPY index.html .

# Instala todas as dependências
RUN npm install

# Copia o código fonte
COPY src/ ./src/

# Build da aplicação
RUN npm run build

# ---- Imagem Final ----
FROM node:18.17.1-alpine3.18

ARG PORT=5173
ENV PORT=${PORT} \
    HOST=0.0.0.0 \
    NODE_ENV=production

# Instalação do Tini
RUN apk add --no-cache tini \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Configuração de usuário não-root com permissões adequadas
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /app/node_modules/.vite && \
    chown -R appuser:appgroup /app

# Copia os arquivos com as permissões corretas
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json .
COPY --from=builder --chown=appuser:appgroup /app/vite.config.js .

# Garante permissões de escrita nos diretórios necessários
RUN chmod 755 /app && \
    chmod -R 755 /app/node_modules && \
    chmod 755 /app/vite.config.js && \
    mkdir -p /app/node_modules/.vite && \
    chmod -R 777 /app/node_modules/.vite

USER appuser

EXPOSE ${PORT}

ENTRYPOINT ["/sbin/tini", "--"]

# Alterado para usar node diretamente com o servidor de preview
CMD ["npm", "run", "preview"]

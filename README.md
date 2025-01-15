# Usar uma imagem Node.js como base
FROM node:18-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de configuração do projeto
COPY package.json package-lock.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor a porta que o Vite usa
EXPOSE 5173

# Comando para rodar o projeto
CMD ["npm", "run", "dev"]

FROM node:18-alpine
WORKDIR /app

# Instala as dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copia o código fonte
COPY . .

EXPOSE 3000

# Comando para iniciar o servidor de desenvolvimento do Next.js
CMD ["npm", "run", "dev"]

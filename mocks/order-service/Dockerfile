# Usamos uma imagem leve do Node
FROM node:18-alpine

# Definimos o diretório de trabalho
WORKDIR /app

# Copiamos os arquivos de dependência
COPY package*.json ./

# Instalamos o essencial
RUN npm install

# Copiamos o nosso código
COPY . .

# Expomos a porta 3000 do container
EXPOSE 3000

# Iniciamos o nosso Microserviço
CMD ["npm", "start"]

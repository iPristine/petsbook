FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

COPY init.sh .
RUN chmod +x init.sh

EXPOSE 3000

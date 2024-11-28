FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

COPY init.sh .
RUN chmod +x init.sh

EXPOSE 3000

CMD ["./init.sh"]

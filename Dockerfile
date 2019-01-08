FROM node:8.11.4
WORKDIR /user/src/back
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]


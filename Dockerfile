FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

HEALTHCHECK --interval=1m --timeout=3s \
  CMD curl -f localhost:3000/api/health || exit 1

CMD [ "npm", "run", "start:prod" ]

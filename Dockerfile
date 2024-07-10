FROM node:20-buster-slim

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]

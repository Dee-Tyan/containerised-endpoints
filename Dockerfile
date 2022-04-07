FROM node:16

WORKDIR /app

COPY . .

RUN yarn

RUN yarn tsc

CMD [ "node", "bin/www" ] 
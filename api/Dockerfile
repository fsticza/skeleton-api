FROM node:12-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN chmod 750 /home/node/app && \
    chown -R node:node /home/node/app && \
    apk update && apk add python2 build-base && \
    npm install && \
    apk del build-base && \
    rm -f /var/cache/apk/*

USER node
COPY . .

EXPOSE 3069

CMD [ "npm", "start" ]

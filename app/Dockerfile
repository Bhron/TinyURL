FROM node:6.6

RUN mkdir -p /app

WORKDIR /app

ADD . /app

RUN cd /app && npm install

EXPOSE 3000

CMD ["node", "/app/server.js"]

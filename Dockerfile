FROM node:9

ENV NPM_CONFIG_LOGLEVEL warn
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV CI 1
COPY package.json /usr/src/app/
RUN npm install --only=production
COPY . /usr/src/app

EXPOSE 3000
CMD ["/usr/local/bin/npm", "start"]

FROM node:16-alpine
ENV NODE_ENV=production
COPY . /origin
WORKDIR /origin

RUN npm install && \
    npm run build && \
    npm prune --production && \
    cp -r dist /app && \
    cp -r node_modules /app/node_modules && \
    rm -rf /origin

WORKDIR /app

EXPOSE 3000

USER node

CMD ["node", "main.js"]

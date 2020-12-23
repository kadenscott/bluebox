FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install\
    && npm install typescript -g
COPY . .
RUN tsc
CMD ["node", "./build/app.js"]
EXPOSE 8080
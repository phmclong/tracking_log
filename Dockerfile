FROM node:10
WORKDIR /app
COPY ./app/package.json /app
RUN npm install
COPY ./app /app
CMD npm start
EXPOSE 3000

FROM node:10
WORKDIR /app
COPY ./app/package.json /app
RUN npm install
RUN npm install -g pkg
COPY ./app /app
RUN pkg bin/www --options expose-gc --targets linux
RUN pkg mqtt/subscriber.js --options max_old_space_size=8192 --targets linux
CMD ./www & ./subcriber
EXPOSE 3000

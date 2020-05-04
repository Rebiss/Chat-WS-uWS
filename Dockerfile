FROM node:latest

COPY . . 

RUN npm install

RUN npm config set strict-ssl false && \
    npm set registry https://npm.betconstruct.int:8888/ && \
    npm install Hermes --no-save && \
    npm set registry https://registry.npmjs.org/ && \
    npm config set strict-ssl true
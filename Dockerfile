FROM node:12.18-alpine AS TypscriptTranspiler
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production --silent
ADD . /app
RUN npm install -g typescript@~3.8.0
RUN tsc

FROM node:12.18-alpine
ENV NODE_ENV production
WORKDIR /app
COPY --from=TypscriptTranspiler /app/node_modules ./node_modules
COPY --from=TypscriptTranspiler /app/dist .
CMD node ./app.js
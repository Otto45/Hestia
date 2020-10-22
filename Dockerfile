FROM node:12.18 AS TypscriptTranspiler
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production --silent
ADD . /app
RUN npm install -g typescript@~3.8.0
RUN tsc

FROM node:12.18

RUN mkdir /app

# Add user so we don't need --no-sandbox.
# same layer as npm install to keep re-chowned files from using up several hundred MBs more space
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

WORKDIR /app

# We install Chrome to get all the OS level dependencies, but Chrome itself
# is not actually used as it's packaged in the node puppeteer library.
# Alternatively, we could could include the entire dep list ourselves
# (https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
# but that seems too easy to get out of date.
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/*

# Grab transpiled code from previous stage's image
COPY --from=TypscriptTranspiler /app/node_modules ./node_modules
COPY --from=TypscriptTranspiler /app/dist .

# Run everything after as non-privileged user.
USER pptruser

ENV NODE_ENV production
ENV SQL_DATABASE Hestia
ENV SQL_ENCRYPT false

CMD node ./app.js
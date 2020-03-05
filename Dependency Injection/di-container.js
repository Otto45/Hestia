const awilix = require('awilix');
const { asValue, asFunction, asClass, Lifetime } = awilix;
const puppeteer = require('puppeteer');

// TODO: Get many user agent strings and rotate them
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36';
const HEADERS = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    'dnt': '1',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none'
};

const container = awilix.createContainer();

container.register({
    browser: asFunction(async () => { return await puppeteer.launch({ headless: false }) })
        .singleton()
        .disposer(async browser => await browser.close()),
    userAgent: asValue(USER_AGENT)
        .singleton(),
    headers: asValue(HEADERS)
        .singleton()
});

container.loadModules([
    ['../human-simulator.js', { formatName: () => { return 'humanSimulator' }, lifetime: Lifetime.SINGLETON }],
    '../zillow.js'
]);

module.exports = container;
const awilix = require('awilix');
const { asValue, asClass } = awilix;
const puppeteer = require('puppeteer');

const HumanSimulator = require('../Util/human-simulator');
const Zillow = require('../Scrapers/scraper');
const HomeInfoRepositoryConsole = require('../Repository Layer/home-info-repository-console');
const HomeInfoRepositoryMysql = require('../Repository Layer/home-info-repository-mysql');

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
let browser;

async function configureContainer() {
    browser = await puppeteer.launch({ headless: false, slowMo: 200 });

    container.register({
        browser: asValue(browser),
        userAgent: asValue(USER_AGENT),
        headers: asValue(HEADERS),
        humanSimulator: asClass(HumanSimulator).singleton(),
        homeInfoRepositoryBase: process.env.NODE_ENV === 'production'
            ? asClass(HomeInfoRepositoryMysql).singleton()
            : asClass(HomeInfoRepositoryConsole).singleton(),
        zillow: asClass(Zillow)
    });

    return container;
}

async function disposeContainer() {
    await container.dispose();
    await browser.close();
}

module.exports = { configureContainer, disposeContainer };
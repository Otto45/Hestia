const { configureContainer, disposeContainer } = require('./Dependency Injection/container-config');
const scraperRegistry = require('./scraper-registry');

const puppeteer = require('puppeteer');
const HumanSimulator = require('./human-simulator');
const Zillow = require('./zillow');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36';
const HEADERS = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    'dnt': '1',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none'
};

// TODO: Dockerize this to contain all chromium, Node.js, and npm packages for this app !!!

(async () => {
    try{
        // var container = await configureContainer();

        const scraperPromises = [];

        const browser = await puppeteer.launch({ headless:false, slowMo: 250 });
        for (let [url, scraperType] of Object.entries(scraperRegistry)) {
            //const scraper = container.resolve(scraperType);
            
            const scraper = new Zillow(browser, USER_AGENT, HEADERS, new HumanSimulator());
            await scraper.searchForHomes(url);
            //scraperPromises.push(container.resolve(scraperType).searchForHomes(url));
        }

        //await Promise.all(scraperPromises);

        //await disposeContainer();
        await browser.close();

    } catch (err) {
        console.log('Catching Error:');
        console.log(err);
    }
})();

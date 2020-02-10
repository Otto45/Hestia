const puppeteer = require('puppeteer');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36';
const URLS = ['https://www.zillow.com/carmel-in/', 'https://www.zillow.com/westfield-in/'];

(async () => {
    try{
        const browser = await puppeteer.launch({headless: false, slowMo: 250});
        const page = await browser.newPage();
        await page.setUserAgent(USER_AGENT);

        for(let i = 0; i < URLS.length; i++){
            await searchForHomesAtLocation(page, URLS[i]);
        }

        await browser.close();
    } catch (err) {
        console.log('Catching Error:');
        console.log(err);
    }
})();

async function searchForHomesAtLocation(page, url){
    await page.goto(url);
    await page.waitForSelector('article.list-card');

    await scrapeHomeInfoFromPage(page);

    while(await isNextPage(page)) {
        page.click('li.zsg-pagination-next > a');
        await page.waitForSelector('article.list-card');
        await scrapeHomeInfoFromPage(page);
    }
}

async function scrapeHomeInfoFromPage(page){
    const homes = await page.$$eval('article.list-card', articles => {
        return articles.map(article => {
            const address = article.querySelector('address.list-card-addr');
            const price = article.querySelector('div.list-card-price');
            return {
                address: address.textContent,
                price: price.textContent
            };
        });
    });

    // TODO: Return home array so it can be aggregated with that from other pages, and all saved into DB in one shot
    // NOTE: For some new constructions, the address is actually the floor plan and community name

    for (let i = 0; i < homes.length; i++){
        console.log(JSON.stringify(homes[i]));
    }
}

async function isNextPage(page){
    return (await page.$('li.zsg-pagination-next > a')) != null;
}
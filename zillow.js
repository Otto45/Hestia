const Scraper = require('./scraper');

class Zillow extends Scraper {

    // protected fields
    _nextPageQuerySelector = 'li.zsg-pagination-next > a';

    // overridden protected methods
    async _scrapeHomeInfoFromPage(page) {
        console.log('Begin scraping...');
        
        await page.evaluate(() => {
            // TODO: Move all web-scraping work in here
            // NOTE: All code inside this function executes in the browser, not Node.js
        });

        // await page.$$eval('article.list-card', articles => {

        //     const address = article.querySelector('address.list-card-addr');
        //     const price = article.querySelector('div.list-card-price');

        //     self.homeInfo.push({
        //         address: address.textContent,
        //         price: price.textContent
        //     });

        //     console.log(JSON.stringify({
        //         address: address.textContent,
        //         price: price.textContent
        //     }));

        // });

        return (await page.$(this._nextPageQuerySelector)) != null;
    }

    async _navigateToNextPage(page) {
        console.log('Navigating to next page.');
        // TODO: Randomize time before actually navigating
        // TODO: Randomize click time
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click(this._nextPageQuerySelector)
        ]);
    }
}

module.exports = Zillow;
const Scraper = require('./scraper');

class Zillow extends Scraper {

    // protected fields
    _nextPageQuerySelector = 'li.zsg-pagination-next > a';

    // overridden protected methods
    async _scrapeHomeInfoFromPage(page) {
        // NOTE: All code inside evaluate() executes in the browser, not Node.js

        this._homeInfo.push(await page.evaluate(() => {
            const homeInfo = [];

            const homeElements = document.querySelectorAll('article.list-card');
            homeElements.forEach(homeElement => {
                const address = homeElement.querySelector('address.list-card-addr');
                const price = homeElement.querySelector('div.list-card-price');

                homeInfo.push({
                    address: address.innerText,
                    price: price.innerText
                });
            });

            return homeInfo;
        }));

        // TODO: Need to perform some human like actions, to make it appear a person is looking through listings
        // This will take a lot more time to scrape every page, but hopefully will stop a recaptcha from appearing
        // E.g. Use methods on puppeteer page object to scroll page if scrollable, and maybe navigate to random home detail pages
        // with a delay before closing, to simulate looking at them

        return (await page.$(this._nextPageQuerySelector)) != null;
    }

    async _navigateToNextPage(page) {
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            this._humanSimulator.clickElementOnPage(page, this._nextPageQuerySelector)
        ]);
    }
}

module.exports = Zillow;
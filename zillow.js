const Scraper = require('./scraper');

class Zillow extends Scraper {

    // protected fields
    _nextPageQuerySelector = 'li.zsg-pagination-next > a';

    // overridden protected methods
    async _scrapeHomeInfoFromPage(page) {
        // NOTE: All code inside this function executes in the browser, not Node.js
        const homeInfo = await page.evaluate(() => {
            let homeInfo = [];
            debugger;
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
        });

        this._homeInfo.push(homeInfo);

        return (await page.$(this._nextPageQuerySelector)) != null;
    }

    async _navigateToNextPage(page) {
        // TODO: Randomize time before actually navigating
        // TODO: Randomize click time
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click(this._nextPageQuerySelector)
        ]);
    }
}

module.exports = Zillow;
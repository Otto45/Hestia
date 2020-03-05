const Scraper = require('./scraper');

class Zillow extends Scraper {

    // overridden protected methods
    async _searchForListOfHomes(page, url) {
        await page.goto(url);
        await page.waitForSelector('article.list-card');
    }

    async _searchHasResults(page) {
        return (await page.$('div.list-card-price')) != null;
    }

    async _scrapeHomeInfoFromPage(page) {
        await page.$$eval('article.list-card', articles => {
            return articles.map(article => {
                const address = article.querySelector('address.list-card-addr');
                const price = article.querySelector('div.list-card-price');

                this.homeInfo.push({
                    address: address.textContent,
                    price: price.textContent
                });

                console.log(JSON.stringify({
                    address: address.textContent,
                    price: price.textContent
                }));
            });
        });
    }

    async _searchResultsHasNextPage(page) {
        return (await page.$('li.zsg-pagination-next > a')) != null;
    }

    async _navigateToNextPage(page) {
        // Randomize time before actually navigating
        // Randomize click time
        await Promise.all([
            page.waitForNavigation(),
            page.click('li.zsg-pagination-next > a')
        ]);
    }
}

module.exports = Zillow;
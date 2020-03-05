const Site = require('./site');

class Zillow extends Site {


    // overridden protected methods
    async _searchForListOfHomes(page) {
        await page.goto(this.url);
        await page.waitForSelector('article.list-card');
    }

    async _searchHasResults(page) {

    }

    async _scrapeHomeInfoFromPage(page) {

    }

    async _searchResultsHasNextPage(page) {

    }

    async _navigateToNextPage(page) {

    }
}

module.exports = Zillow;
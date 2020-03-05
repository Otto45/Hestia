// abstract class
class Scraper {
    constructor({ browser, userAgent, headers, humanSimulator }) {
        // private
        this._browser = browser;
        this._userAgent = userAgent;
        this._headers = headers;

        // protected
        this._humanSimulator = humanSimulator;

        // public
        this.homeInfo = [];
    }

    // abstract protected methods
    async _searchForListOfHomes(page, url) { }
    async _searchHasResults(page) { }
    async _scrapeHomeInfoFromPage(page) { }
    async _searchResultsHasNextPage(page) { }
    async _navigateToNextPage(page) { }

    // protected methods
    async _createNewPage() {
        const page = await this._browser.newPage();
        await page.setUserAgent(this._userAgent);
        await page.setExtraHTTPHeaders(this._headers);

        return page;
    }

    // public methods
    async searchForHomes(url) {
        const page = await this._createNewPage();

        await this._searchForListOfHomes(page, url);

        if (!(await this._searchHasResults(page))) {
            return;
        }

        await this._scrapeHomeInfoFromPage(page);

        while (await this._searchResultsHasNextPage(page)) {
            await this._navigateToNextPage(page);
            await this._scrapeHomeInfoFromPage(page);
        }
    }

    getScrapedHomeInfo() {
        return this.homeInfo;
    }
}

module.exports = Scraper;
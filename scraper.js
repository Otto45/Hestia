// abstract class
class Scraper {
    constructor(browser, userAgent, headers, humanSimulator) {
        // private
        this._browser = browser;
        this._userAgent = userAgent;
        this._headers = headers;

        // protected
        this._humanSimulator = humanSimulator;
    }

    // protected fields
    _nextPageQuerySelector;
    _homeInfo = [];

    // abstract protected methods
    async _scrapeHomeInfoFromPage(page) { }
    async _navigateToNextPage(page) { }

    // protected methods
    async _createNewPage() {
        const page = await this._browser.newPage();
        await page.setUserAgent(this._userAgent);
        await page.setExtraHTTPHeaders(this._headers);

        return page;
    }

    async _searchForHomes(page) { } // Some scrapers will not need to override this,
                                    // as a site's base URL can include the city (e.g. Zillow scrapers)

    // public methods
    async searchForHomes(url) {
        // TODO: Parallelize with browsers, not pages
        const page = await this._createNewPage();
        await page.goto(url, { waitUntil: 'networkidle0' });

        await this._searchForHomes(page);
        console.log('Search complete.');

        let searchResultsHasNextPage = false;

        do {
            searchResultsHasNextPage = await this._scrapeHomeInfoFromPage(page);
        }
        while (searchResultsHasNextPage) {
            await this._navigateToNextPage(page);
            searchResultsHasNextPage = await this._scrapeHomeInfoFromPage(page);
        }
    }

    getScrapedHomeInfo() {
        return this._homeInfo;
    }
}

module.exports = Scraper;
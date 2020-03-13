// abstract class
class Scraper {
    constructor({browser, userAgent, headers, homeInfoRepositoryBase, humanSimulator}) {
        // private
        this._browser = browser;
        this._userAgent = userAgent;
        this._headers = headers;
        this._homeInfoRepositoryBase = homeInfoRepositoryBase;

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
        // NOTE: Each unique website should really be scraped with its own docker container, running this code,
        // to ensure that browser cached data, leaked memory, zombie procs, etc. don't bleed into scrapers for other sites

        const page = await this._createNewPage();
        await page.goto(url, { waitUntil: 'networkidle0' });

        await this._searchForHomes(page);

        let searchResultsHasNextPage = await this._scrapeHomeInfoFromPage(page);

        while (searchResultsHasNextPage) {
            await this._navigateToNextPage(page);
            searchResultsHasNextPage = await this._scrapeHomeInfoFromPage(page);
        }

        if (this._homeInfo.length > 0) {
            this._homeInfoRepositoryBase.saveHomeInfo(this._homeInfo);
        }
    }
}

module.exports = Scraper;
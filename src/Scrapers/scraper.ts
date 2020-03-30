import { Browser, Page } from "puppeteer";
import HomeInfoRepositoryBase from "../Repository Layer/home-info-repository-base";
import HumanSimulator from "../Util/human-simulator";
import HomeInfo from "../home-info-placeholder";

abstract class Scraper {
    
    constructor(
        private _browser: Browser,
        private _userAgent: string,
        private _headers: Record<string, string>,
        private _homeInfoRepositoryBase: HomeInfoRepositoryBase,
        protected humanSimulator: HumanSimulator) { }

    protected homeInfo: Array<HomeInfo> = [];

    protected abstract async _scrapeHomeInfoFromPage(page: Page): Promise<boolean>;
    protected abstract async _navigateToNextPage(page: Page): Promise<void>;

    protected async _createNewPage(): Promise<Page> {
        const page = await this._browser.newPage();
        await page.setUserAgent(this._userAgent);
        await page.setExtraHTTPHeaders(this._headers);

        return page;
    }

    // Some scrapers will not need to override this, as a site's base URL can include the city (e.g. Zillow scrapers)
    protected async _searchForHomes(page: Page): Promise<void> { }

    public async searchForHomes(url: string): Promise<void> {
        // TODO: Each unique website should really be scraped with its own docker container, running this code,
        // to ensure that browser cached data, leaked memory, zombie procs, etc. don't bleed into scrapers for other sites

        try {
            const page = await this._createNewPage();
            await page.goto(url, { waitUntil: 'networkidle0' });

            await this._searchForHomes(page);

            let searchResultsHasNextPage = await this._scrapeHomeInfoFromPage(page);

            while (searchResultsHasNextPage) {
                await this._navigateToNextPage(page);
                searchResultsHasNextPage = await this._scrapeHomeInfoFromPage(page);
            }

            if (this.homeInfo.length > 0) {
                this._homeInfoRepositoryBase.saveHomeInfo(this.homeInfo);
            }
        } catch(err) {
            // TODO: See if error was due to a recaptcha appearing, come up with retry plan for that case
            // Otherwise, throw error up call stack
            console.log(err);
        }
    }
}

export default Scraper;
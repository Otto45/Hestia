import { Page } from "puppeteer";
import HomeInfoRepositoryBase from "../Repository Layer/home-info-repository-base";
import HomeInfo from "../home-info-placeholder";
import BrowserWrapper from "../Util/browser-wrapper";
import { injectable } from "inversify";
import LoggerBase from "../Util/Logger/logger-base";

@injectable()
export default abstract class Scraper {
    
    constructor(
        private _logger: LoggerBase,
        private _browser: BrowserWrapper,
        private _homeInfoRepositoryBase: HomeInfoRepositoryBase) { }

    protected homeInfo: Array<HomeInfo> = [];
    protected userAgent:string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36';
    protected headers: Record<string, string> = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'dnt': '1',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none'
    };
    

    protected abstract async _scrapeHomeInfoFromPage(page: Page): Promise<boolean>;
    protected abstract async _navigateToNextPage(page: Page): Promise<void>;

    protected async _createNewPage(): Promise<Page> {
        const page = await this._browser.newPage();
        await page.setUserAgent(this.userAgent);
        await page.setExtraHTTPHeaders(this.headers);

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
            
            throw err;
        }
    }
}

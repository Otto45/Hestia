import Scraper from './scraper';
import { injectable } from 'inversify';
import { Page, Browser } from 'puppeteer';
import HomeInfo from '../home-info-placeholder';
import ArrayUtil from '../Util/array-util';
import HomeInfoRepositoryBase from '../Repository Layer/home-info-repository-base';
import HumanSimulator from '../Util/human-simulator';

@injectable()
export default class Zillow extends Scraper {

    constructor(
        _browser: Browser,
        _homeInfoRepositoryBase: HomeInfoRepositoryBase,
        private _humanSimulator: HumanSimulator) {
            super(_browser, _homeInfoRepositoryBase);
        }

    private _nextPageQuerySelector = 'li.zsg-pagination-next > a';

    // overridden protected methods
    protected async _scrapeHomeInfoFromPage(page: Page) {
        // NOTE: All code inside evaluate() executes in the browser, not Node.js

        const homeInfoFromBrowser = await page.evaluate(() => {
            const homeInfo: Array<HomeInfo> = [];

            const homeElements = document.querySelectorAll('article.list-card');
            homeElements.forEach(homeElement => {
                const address = homeElement.querySelector('address.list-card-addr');
                const price = homeElement.querySelector('div.list-card-price');

                let newHomeInfo = new HomeInfo();
                newHomeInfo.Address = address?.textContent ?? '';
                newHomeInfo.Price = price?.textContent ?? '';

                homeInfo.push(newHomeInfo);
            });

            return homeInfo;
        });

        ArrayUtil.pushMany(this.homeInfo, homeInfoFromBrowser);

        // TODO: Need to perform some human like actions, to make it appear a person is looking through listings
        // This will take a lot more time to scrape every page, but hopefully will stop a recaptcha from appearing
        // E.g. Use methods on puppeteer page object to scroll page if scrollable, and maybe navigate to random home detail pages
        // with a delay before closing, to simulate looking at them

        return (await page.$(this._nextPageQuerySelector)) != null;
    }

    protected async _navigateToNextPage(page: Page) {
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            this._humanSimulator.clickElementOnPage(page, this._nextPageQuerySelector)
        ]);
    }
}

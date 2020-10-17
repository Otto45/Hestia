import ScraperBase from './scraper-base';
import { injectable } from 'inversify';
import { Page } from 'puppeteer';
import ArrayUtil from '../Util/array-util';
import HomeInfoRepositoryBase from '../Repository Layer/home-info-repository-base';
import HumanSimulator from '../Util/human-simulator';
import BrowserWrapper from '../Util/browser-wrapper';
import LoggerBase from '../Util/Logger/logger-base';

@injectable()
export default class ZillowScraper extends ScraperBase {

    constructor(
        protected _logger: LoggerBase,
        _browser: BrowserWrapper,
        _homeInfoRepositoryBase: HomeInfoRepositoryBase,
        private _humanSimulator: HumanSimulator) {
            super(_logger, _browser, _homeInfoRepositoryBase);
        }

    // overridden protected methods
    protected async _scrapeHomeInfoFromPage(page: Page) {
        // NOTE: All code inside evaluate() executes in the browser,
        // so types should be ignored here to get as close as possible to vanilla javascript

        const homeInfoFromBrowser = await page.evaluate(() => {
            const homeInfo: any = [];

            const homeElements = document.querySelectorAll('article.list-card');
            homeElements.forEach(homeElement => {
                const address = homeElement.querySelector('address.list-card-addr');
                const price = homeElement.querySelector('div.list-card-price');

                const newHomeInfo = {
                    Address: address?.textContent ?? '',
                    Price: price?.textContent ?? ''
                }

                homeInfo.push(newHomeInfo);
            });

            return homeInfo;
        });

        ArrayUtil.pushMany(this.homeInfo, homeInfoFromBrowser);

        // TODO: Need to perform some human like actions, to make it appear a person is looking through listings
        // This will take a lot more time to scrape every page, but hopefully will stop a recaptcha from appearing
        // E.g. Use methods on puppeteer page object to scroll page if scrollable, and maybe navigate to random home detail pages
        // with a delay before closing, to simulate looking at them

        return (await this.getNextPageLink(page)) !== '';
    }

    protected async _navigateToNextPage(page: Page) {
        const nextPageLink = await this.getNextPageLink(page);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            this._humanSimulator.clickElementOnPage(page, nextPageLink)
        ]);
    }

    private async getNextPageLink(page: Page): Promise<string> {
        const nextPageAnchorTagElementQuerySelector = 'div.search-pagination > nav > ul > li:last-child > a';

        const nextPageAnchorTagElement = await page.$(nextPageAnchorTagElementQuerySelector);

        if (nextPageAnchorTagElement === null) {
            return '';
        }
        
        const isNextPageAnchorTagDisabled = await nextPageAnchorTagElement.evaluate(node => node.hasAttribute('disabled'));

        if (isNextPageAnchorTagDisabled) {
            return '';
        }

        return nextPageAnchorTagElementQuerySelector;
    }
}

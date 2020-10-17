import HomeInfoRepositoryBase from "../Repository Layer/home-info-repository-base";
import HomeInfo from "./Dto/home-info";
import BrowserWrapper from "../Util/browser-wrapper";
import { injectable, inject } from "inversify";
import LoggerBase from "../Util/Logger/logger-base";
import ScraperBase from "./scraper-base";
import { Page } from "puppeteer";
import ArrayUtil from "../Util/array-util";

@injectable()
export default class ScraperHardCoded extends ScraperBase {

    constructor(
        protected _logger: LoggerBase,
        _browser: BrowserWrapper,
        _homeInfoRepositoryBase: HomeInfoRepositoryBase) {
            super(_logger, _browser, _homeInfoRepositoryBase);
        }

    protected _scrapeHomeInfoFromPage(page: Page): Promise<boolean> {
        const fakeHomes: HomeInfo[] = [
            { Address: '123 Main St, Carmel, IN, 46033', Price: '$150,000' },
            { Address: '456 Main St, Carmel, IN, 46033', Price: '$200,000' },
            { Address: '789 Main St, Carmel, IN, 46033', Price: '$300,000' }
        ];

        ArrayUtil.pushMany(this.homeInfo, fakeHomes);

        return Promise.resolve(false);
    }

    protected _navigateToNextPage(page: Page): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
import * as awilix from 'awilix';
const { createContainer, asValue, asClass } = awilix;
import { launch, Browser } from 'puppeteer';

import HumanSimulator from '../Util/human-simulator';
import Zillow from '../Scrapers/zillow';
import HomeInfoRepositoryConsole from '../Repository Layer/home-info-repository-console';
import HomeInfoRepositoryMysql from '../Repository Layer/home-info-repository-mysql';

// TODO: Get many user agent strings and rotate them
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36';

const HEADERS = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    'dnt': '1',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none'
};

export class ContainerConfiguration {
    static container = createContainer();
    static browser: Browser;

    public static async create(): Promise<any> {
        ContainerConfiguration.browser = await launch({ headless: false, slowMo: 200 });
    
        ContainerConfiguration.container.register({
            browser: asValue(ContainerConfiguration.browser),
            userAgent: asValue(USER_AGENT),
            headers: asValue(HEADERS),
            humanSimulator: asClass(HumanSimulator).singleton(),
            homeInfoRepositoryBase: process.env.NODE_ENV === 'production'
                ? asClass(HomeInfoRepositoryMysql).singleton()
                : asClass(HomeInfoRepositoryConsole).singleton(),
            zillow: asClass(Zillow)
        });
    
        return ContainerConfiguration.container;
    }
    
    public static async dispose(): Promise<void> {
        await ContainerConfiguration.container.dispose();
        await ContainerConfiguration.browser.close();
    }
}

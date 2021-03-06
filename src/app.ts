import 'reflect-metadata'; // This has to be imported globally for Inversify to work
import { IocContainerConfiguration } from './Dependency Injection/ioc-container';
import scraperRegistry from './scraper-registry';
import ScraperBase from './Scrapers/scraper-base';
import LoggerBase from './Util/Logger/logger-base';

const container = IocContainerConfiguration.configureContainer();

(async () => {
    try {
        
        const scraperPromises: Array<Promise<void>> = [];

        for (let [url, scraperType] of Object.entries(scraperRegistry)) {
            const scraper = container.get(scraperType) as ScraperBase;
            scraperPromises.push(scraper.searchForHomes(url));
        }

        await Promise.all(scraperPromises);

    } catch (err) {
        container.get(LoggerBase).error(err);
    }
})();

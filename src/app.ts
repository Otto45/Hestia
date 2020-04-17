import 'reflect-metadata'; // This has to be imported globally for Inversify to work
import { IocContainerConfiguration } from './Dependency Injection/ioc-container';
import scraperRegistry from './scraper-registry';
import Scraper from './Scrapers/scraper';

// TODO: Dockerize this app

(async () => {
    try {
        var container = IocContainerConfiguration.configureContainer();
        const scraperPromises: Array<Promise<void>> = [];

        for (let [url, scraperType] of Object.entries(scraperRegistry)) {
            const scraper = container.get(scraperType) as Scraper;
            scraperPromises.push(scraper.searchForHomes(url));
        }

        await Promise.all(scraperPromises);

    } catch (err) {
        console.log(err);
        // TODO: Implement app level logger to be injected
    }
})();

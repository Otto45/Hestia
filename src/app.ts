import { ContainerConfiguration } from './Dependency Injection/container-config';
import scraperRegistry from './scraper-registry';
import Scraper from './Scrapers/scraper';

// TODO: Dockerize this to contain all chromium, Node.js, and npm packages for this app !!!

(async () => {
    try {
        var container = await ContainerConfiguration.create();
        const scraperPromises: Array<Promise<void>> = [];

        for (let [url, scraperType] of Object.entries(scraperRegistry)) {
            const scraper = container.resolve(scraperType) as Scraper;
            scraperPromises.push(scraper.searchForHomes(url));
        }

        await Promise.all(scraperPromises);

        await ContainerConfiguration.dispose();

    } catch (err) {
        console.log(err);
        // TODO: Implement app level logger to be injected
    }
})();

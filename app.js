const { configureContainer, disposeContainer } = require('./Dependency Injection/container-config');
const scraperRegistry = require('./scraper-registry');

// TODO: Dockerize this to contain all chromium, Node.js, and npm packages for this app !!!

(async () => {
    try {
        var container = await configureContainer();
        const scraperPromises = [];

        for (let [url, scraperType] of Object.entries(scraperRegistry)) {
            const scraper = container.resolve(scraperType);
            scraperPromises.push(scraper.searchForHomes(url));
        }

        await Promise.all(scraperPromises);

        await disposeContainer();

    } catch (err) {
        console.log(err);
        // TODO: Implement app level logger to be injected
    }
})();

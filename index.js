const { container } = require('./Dependency Injection/di-container');
const { scraperRegistry } = require('./scraper-registry');

(async () => {
    try{
        const scraperPromises = [];

        for (let [url, scraperType] of Object.entries(scraperRegistry)) {
            scrapers.push(container.resolve(scraperType).searchForHomes(url));
        }

        await Promise.all(scraperPromises);

        container.dispose();
        
    } catch (err) {
        console.log('Catching Error:');
        console.log(err);
    }
})();

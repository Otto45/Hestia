const { configureContainer, disposeContainer } = require('./Dependency Injection/container-config');
const scraperRegistry = require('./scraper-registry');

(async () => {
    try{
        var container = await configureContainer();

        const scraperPromises = [];

        for (let [url, scraperType] of Object.entries(scraperRegistry)) {
            await container.resolve(scraperType).searchForHomes(url);
            //scraperPromises.push(container.resolve(scraperType).searchForHomes(url));
        }

        //await Promise.all(scraperPromises);

        await disposeContainer();

    } catch (err) {
        console.log('Catching Error:');
        console.log(err);
    }
})();

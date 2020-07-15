import { TYPES } from './Dependency Injection/ioc-container';

const scraperRegistry: { [url: string]: string } = {};

scraperRegistry['https://www.zillow.com/carmel-in/'] = TYPES.zillow;

// Right now only one zillow scraper can be active, until they are improved to beat the bot detection

//scraperRegistry['https://www.zillow.com/westfield-in/'] = TYPES.zillow;

export default scraperRegistry;
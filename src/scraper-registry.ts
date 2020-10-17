import { TYPES } from './Dependency Injection/ioc-container';

const scraperRegistry: { [url: string]: string } = {};

// Right now only one zillow scraper can be active, until they are improved to beat the bot detection

// scraperRegistry['https://google.com/'] = TYPES.hardCoded;

// scraperRegistry['https://zillow.com/carmel-in/'] = TYPES.zillow;

// scraperRegistry['https://zillow.com/westfield-in/'] = TYPES.zillow;

scraperRegistry['https://zillow.com/indianapolis-in/'] = TYPES.zillow;

export default scraperRegistry;
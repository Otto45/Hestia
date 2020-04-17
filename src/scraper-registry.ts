import { TYPES } from './Dependency Injection/ioc-container';

const scraperRegistry: { [url: string]: string } = {};

scraperRegistry['https://www.zillow.com/carmel-in/'] = TYPES.zillow;
//scraperRegistry['https://www.zillow.com/westfield-in/'] = TYPES.zillow;

export default scraperRegistry;
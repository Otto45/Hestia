import Scraper from './Scrapers/scraper';
import Zillow from './Scrapers/zillow';

const scraperRegistry: { [url: string]: Scraper } = {};

scraperRegistry['https://www.zillow.com/carmel-in/'] = Zillow;
//scraperRegistry['https://www.zillow.com/westfield-in/'] = Zillow;

export default scraperRegistry;
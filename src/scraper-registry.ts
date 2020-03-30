import Scraper from './Scrapers/scraper';
import Zillow from './Scrapers/zillow';

const scraperRegistry: { [url: string]: string } = {};

scraperRegistry['https://www.zillow.com/carmel-in/'] = typeof(Zillow);
//scraperRegistry['https://www.zillow.com/westfield-in/'] = typeof(Zillow);

export default scraperRegistry;
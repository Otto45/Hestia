import { Container } from 'inversify';
import Configuration from '../config';

import HumanSimulator from '../Util/human-simulator';
import ZillowScraper from '../Scrapers/scraper-zillow';
import HomeInfoRepositoryConsole from '../Repository Layer/home-info-repository-console';
import HomeInfoRepositorySqlServer from '../Repository Layer/home-info-repository-sqlserver';
import HomeInfoRepositoryBase from '../Repository Layer/home-info-repository-base';
import BrowserWrapper from '../Util/browser-wrapper';
import LoggerBase from '../Util/Logger/logger-base';
import LoggerWinston from '../Util/Logger/logger-winston';
import HomeInfoDataBase from '../Data Layer/home-info-data-base';
import HomeInfoDataSqlServer from '../Data Layer/home-info-data-sqlserver';
import ScraperHardCoded from '../Scrapers/scraper-hard-coded';

export const TYPES = {
    hardCoded: 'HardCoded',
    zillow: 'Zillow'
}

export class IocContainerConfiguration {

    public static configureContainer(): Container {
        let container = new Container();

        // Singleton
        container.bind(HumanSimulator).toSelf().inSingletonScope();
        container.bind(LoggerBase).to(LoggerWinston).inSingletonScope();
        container.bind(HomeInfoDataBase).to(HomeInfoDataSqlServer).inSingletonScope();

        if (Configuration.NodeEnv === 'production') {
            container
                .bind(HomeInfoRepositoryBase)
                .to(HomeInfoRepositorySqlServer)
                .inSingletonScope();
        } else {
            container
                .bind(HomeInfoRepositoryBase)
                .to(HomeInfoRepositoryConsole)
                .inSingletonScope();
        }

        // Transient
        container.bind(BrowserWrapper).toSelf();
        container.bind<ZillowScraper>(TYPES.zillow).to(ZillowScraper);
        container.bind<ScraperHardCoded>(TYPES.hardCoded).to(ScraperHardCoded);


        return container;
    }
}

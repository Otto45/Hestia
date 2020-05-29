import { Container } from 'inversify';

import HumanSimulator from '../Util/human-simulator';
import Zillow from '../Scrapers/zillow';
import HomeInfoRepositoryConsole from '../Repository Layer/home-info-repository-console';
import HomeInfoRepositoryMysql from '../Repository Layer/home-info-repository-mysql';
import HomeInfoRepositoryBase from '../Repository Layer/home-info-repository-base';
import BrowserWrapper from '../Util/browser-wrapper';
import LoggerBase from '../Util/Logger/logger-base';
import LoggerWinston from '../Util/Logger/logger-winston';

export const TYPES = {
    zillow: 'Zillow'
}

export class IocContainerConfiguration {

    public static configureContainer(): Container {
        let container = new Container();

        // Singleton
        container.bind(HumanSimulator).toSelf().inSingletonScope();
        container.bind(LoggerBase).to(LoggerWinston).inSingletonScope();

        if (process.env.NODE_ENV === 'production') {
            container
                .bind(HomeInfoRepositoryBase)
                .to(HomeInfoRepositoryMysql)
                .inSingletonScope();
        } else {
            container
                .bind(HomeInfoRepositoryBase)
                .to(HomeInfoRepositoryConsole)
                .inSingletonScope();
        }

        // Transient
        container.bind(BrowserWrapper).toSelf();
        container.bind<Zillow>(TYPES.zillow).to(Zillow);


        return container;
    }
}

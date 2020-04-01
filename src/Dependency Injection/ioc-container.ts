import { Container } from 'inversify';
import { launch, Browser } from 'puppeteer';

import HumanSimulator from '../Util/human-simulator';
import Zillow from '../Scrapers/zillow';
import HomeInfoRepositoryConsole from '../Repository Layer/home-info-repository-console';
import HomeInfoRepositoryMysql from '../Repository Layer/home-info-repository-mysql';

export default class IocContainerFactory {

    public static async createIocContainer(): Promise<any> {
        const container = new Container();

        // TODO: create a provider (async factory) in order to bind browser object, as it must be created asyncly

        container.bind<Zillow>(Zillow).toSelf();
        container.bind<HumanSimulator>(HumanSimulator).toSelf().inSingletonScope();
    
        return container;
    }
}

import { Container, interfaces,  } from 'inversify';
import { launch } from 'puppeteer';

import HumanSimulator from '../Util/human-simulator';
import Zillow from '../Scrapers/zillow';
import HomeInfoRepositoryConsole from '../Repository Layer/home-info-repository-console';
import HomeInfoRepositoryMysql from '../Repository Layer/home-info-repository-mysql';
import HomeInfoRepositoryBase from '../Repository Layer/home-info-repository-base';
import Scraper from '../Scrapers/scraper';

type Provider<T> = () => Promise<T>;

const TYPES = {
    zillowProvider: 'ZillowProvider',
    zillow: 'zillow'
}

export class IocContainerWrapper {

    private container: Container = this.createIocContainer();

    private createIocContainer(): Container {
        const container = new Container();

        container.bind(HumanSimulator).toSelf().inSingletonScope();

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

        container.bind<Provider<Zillow>>(TYPES.zillowProvider).toProvider<Zillow>((context) => {
            return () => {
                return async () => {
                    const browser = await launch({ headless: false, slowMo: 200 });
                    const homeInfoRepository = context.container.get<HomeInfoRepositoryBase>(HomeInfoRepositoryBase);
                    const humanSimulator = context.container.get<HumanSimulator>(HumanSimulator);

                    return new Zillow(browser, homeInfoRepository, humanSimulator);
                }
            }
        });

        return container;
    }

    public async get<T extends Scraper>(serviceIdentifier: interfaces.ServiceIdentifier<T>): Promise<T> {
        const provider = this.container.resolve(Provider<T>);
    }
}

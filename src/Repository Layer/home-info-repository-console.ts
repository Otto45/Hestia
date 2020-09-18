import HomeInfo from "../Scrapers/Dto/home-info-placeholder";
import HomeInfoRepositoryBase from './home-info-repository-base';
import { injectable, inject } from "inversify";
import LoggerBase from "../Util/Logger/logger-base";

injectable()
export default class HomeInfoRepositoryConsole extends HomeInfoRepositoryBase {

    // Have to explicitly define injected argument b/c base class doesn't have it
    constructor(@inject(LoggerBase) private _logger: LoggerBase) {
        super();
    }

    // public overridden methods
    public async saveHomeInfo(homeInfo: Array<HomeInfo>): Promise<void> {
        Promise.resolve(() => this._logger.info(JSON.stringify(homeInfo)));
    }
}

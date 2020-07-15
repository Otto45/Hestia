import HomeInfo from "../home-info-placeholder";
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
    public saveHomeInfo(homeInfo: Array<HomeInfo>) {
        this._logger.info(JSON.stringify(homeInfo));
    }
}

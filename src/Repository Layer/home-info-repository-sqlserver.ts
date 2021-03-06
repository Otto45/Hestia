import HomeInfo from "../Scrapers/Dto/home-info";
import HomeInfoRepositoryBase from './home-info-repository-base';
import { injectable, inject } from "inversify";
import HomeInfoDataBase from "../Data Layer/home-info-data-base";

injectable()
export default class HomeInfoRepositorySqlServer extends HomeInfoRepositoryBase {

    // Have to explicitly define injected argument b/c base class doesn't have it
    constructor(@inject(HomeInfoDataBase) private _dataBase: HomeInfoDataBase) {
        super();
    }

    // public overridden methods
    public async saveHomeInfo(homeInfo: Array<HomeInfo>): Promise<void> {
        await this._dataBase.saveHomeInfo(homeInfo);
    }
}

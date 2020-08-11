import HomeInfoDataBase from "./home-info-data-base";
import HomeInfo from "../home-info-placeholder";
import { injectable } from "inversify";

@injectable()
export default class HomeInfoDataSqlServer extends HomeInfoDataBase {

    public saveHomeInfo(homeInfo: Array<HomeInfo>): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
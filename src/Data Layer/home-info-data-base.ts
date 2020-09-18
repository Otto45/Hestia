import HomeInfo from "../Scrapers/Dto/home-info-placeholder";
import { injectable } from "inversify";

@injectable()
export default abstract class HomeInfoDataBase {

    public abstract async saveHomeInfo(homeInfo: Array<HomeInfo>): Promise<void>;

}
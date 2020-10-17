import HomeInfo from '../Scrapers/Dto/home-info';
import { injectable } from 'inversify';

@injectable()
export default abstract class HomeInfoRepositoryBase {

    public abstract async saveHomeInfo(homeInfo: Array<HomeInfo>): Promise<void>;

}

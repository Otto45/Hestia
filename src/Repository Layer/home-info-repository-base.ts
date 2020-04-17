import HomeInfo from '../home-info-placeholder';
import { injectable } from 'inversify';

@injectable()
export default abstract class HomeInfoRepositoryBase {
    
    public abstract saveHomeInfo(homeInfo: Array<HomeInfo>): void;
}

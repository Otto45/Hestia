import HomeInfo from '../home-info-placeholder';

export default abstract class HomeInfoRepositoryBase {
    
    public abstract saveHomeInfo(homeInfo: Array<HomeInfo>): void;
}

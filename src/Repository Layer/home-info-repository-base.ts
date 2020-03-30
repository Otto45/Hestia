import HomeInfo from '../home-info-placeholder';

abstract class HomeInfoRepositoryBase {
    
    public abstract saveHomeInfo(homeInfo: Array<HomeInfo>): void;
}

export default HomeInfoRepositoryBase;
import HomeInfo from "../home-info-placeholder";
import HomeInfoRepositoryBase from './home-info-repository-base';

class HomeInfoRepositoryConsole extends HomeInfoRepositoryBase {

    // public overridden methods
    public saveHomeInfo(homeInfo: Array<HomeInfo>) {
        console.log(JSON.stringify(homeInfo));
    }
}

export default HomeInfoRepositoryConsole;
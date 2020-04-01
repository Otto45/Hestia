import HomeInfo from "../home-info-placeholder";
import HomeInfoRepositoryBase from './home-info-repository-base';

export default class HomeInfoRepositoryConsole extends HomeInfoRepositoryBase {

    // public overridden methods
    public saveHomeInfo(homeInfo: Array<HomeInfo>) {
        console.log(JSON.stringify(homeInfo));
    }
}
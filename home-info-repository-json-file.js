const HomeInfoRepositoryBase = require('./home-info-repository-base');

class HomeInfoRepositoryJsonFile extends HomeInfoRepositoryBase {
    // public overridden methods
    saveHomeInfo(homeInfo) {
        const homeInfoAsJson = JSON.stringify(homeInfo);
        // TODO: Save out to file
    }
}

module.exports = HomeInfoRepositoryConsole;
let HomeInfoRepositoryBase = require('./home-info-repository-base');

class HomeInfoRepositoryConsole extends HomeInfoRepositoryBase {
    // public overridden methods
    saveHomeInfo(homeInfo) {
        console.log(JSON.stringify(homeInfo));
    }
}

module.exports = HomeInfoRepositoryConsole;
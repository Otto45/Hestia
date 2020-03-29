const NotImplementedError = require('../Custom Errors/NotImplementedError');

// abstract class
class HomeInfoRepositoryBase {
    // abstract public methods
    saveHomeInfo(homeInfo) { throw new NotImplementedError('saveHomeInfo abstract method needs to be implemented in a class derived from HomeInfoRepositoryBase.') }
}

export default HomeInfoRepositoryBase;
import HomeInfoDataBase from "./home-info-data-base";
import HomeInfo from "../Scrapers/Dto/home-info";
import Configuration from "../config";
import { injectable, inject } from "inversify";
import { ConnectionPool, config, NVarChar } from "mssql";
import LoggerBase from "../Util/Logger/logger-base";

@injectable()
export default class HomeInfoDataSqlServer extends HomeInfoDataBase {

    constructor(@inject(LoggerBase) private _logger: LoggerBase ) {
        super();
    }

    private _config: config = {
        server: Configuration.SqlServer,
        database: Configuration.SqlDatabase,
        user: Configuration.SqlUser,
        password: Configuration.SqlPassword,
        port: +Configuration.SqlPort
    };

    public async saveHomeInfo(homeInfo: Array<HomeInfo>): Promise<void> {
        const pool: ConnectionPool = new ConnectionPool(this._config);

        try{
            await pool.connect();

            await pool.request()
            .input('SemicolonDelimitedHomeInfoList', NVarChar, this.serializeHomeInfoForStoredProcedure(homeInfo))
            .execute('dbo.InsertHomeInfoList');

        } catch(err) {

            this._logger.error(err);

        } finally {
            if (pool !== null && pool !== undefined && pool.connected) {
                await pool.close();
            }
        }        
    }

    private serializeHomeInfoForStoredProcedure(homeInfo: Array<HomeInfo>): string {
        let serializedHomeInfo = '';
        homeInfo.forEach(individualHomeInfo => {
            if (serializedHomeInfo !== '') {
                serializedHomeInfo += ';';
            }

            serializedHomeInfo += individualHomeInfo.Address + ':' + individualHomeInfo.Price;
        });

        return serializedHomeInfo;
    }

}
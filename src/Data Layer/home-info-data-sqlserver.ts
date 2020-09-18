import HomeInfoDataBase from "./home-info-data-base";
import HomeInfo from "../Scrapers/Dto/home-info-placeholder";
import Configuration from "../config";
import { injectable } from "inversify";
import { ConnectionPool, config, NVarChar } from "mssql";

@injectable()
export default class HomeInfoDataSqlServer extends HomeInfoDataBase {

    private _config: config = {
        server: Configuration.SqlServer,
        database: Configuration.SqlDatabase,
        user: Configuration.SqlUser,
        password: Configuration.SqlPassword,
        port: +Configuration.SqlPort
    };

    public async saveHomeInfo(homeInfo: Array<HomeInfo>): Promise<void> {
        let pool = new ConnectionPool(this._config);

        await pool.request()
            .input('@SemicolonDelimitedHomeInfoList', NVarChar, this.serializeHomeInfoForStoredProcedure(homeInfo))
            .execute('dbo.InsertHomeInfoList');

        await pool.close();
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
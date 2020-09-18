import { config } from 'dotenv';
import { assert } from 'console';

config();

const { 
    NODE_ENV,
    SQL_SERVER,
    SQL_PORT,
    SQL_DATABASE,
    SQL_USER,
    SQL_PASSWORD,
    LOG_LEVEL
 } = process.env;

 assert( SQL_SERVER, "SQL_SERVER configuration is required." );
 assert( SQL_PORT, "SQL_PORT configuration is required." );
 assert( SQL_DATABASE, "SQL_DATABASE configuration is required." );
 assert( SQL_USER, "SQL_USER configuration is required." );
 assert( SQL_PASSWORD, "SQL_PASSWORD configuration is required." );

export default class Configuration {
    public static NodeEnv: string = NODE_ENV as string;
    public static SqlServer: string = SQL_SERVER as string;
    public static SqlPort: string = SQL_PORT as string;
    public static SqlDatabase: string = SQL_DATABASE as string;
    public static SqlUser: string = SQL_USER as string;
    public static SqlPassword: string = SQL_PASSWORD as string;
    public static LogLevel: string = (LOG_LEVEL !== null && LOG_LEVEL !== undefined) ? LOG_LEVEL : 'warn';
}

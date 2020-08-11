import { config } from 'dotenv';
import { assert } from 'console';

config();

const { 
    NODE_ENV,
    PORT,
    SQL_SERVER,
    SQL_DATABASE,
    SQL_USER,
    SQL_PASSWORD
 } = process.env;

 assert( PORT, "PORT configuration is required." );
 assert( SQL_SERVER, "SQL_SERVER configuration is required." );
 assert( SQL_DATABASE, "SQL_DATABASE configuration is required." );
 assert( SQL_USER, "SQL_USER configuration is required." );
 assert( SQL_PASSWORD, "SQL_PASSWORD configuration is required." );

export default class Configuration {
    public static NodeEnv: string = NODE_ENV as string;
    public static Port: string = PORT as string;
    public static SqlServer: string = SQL_SERVER as string;
    public static SqlDatabase: string = SQL_DATABASE as string;
    public static SqlUser: string = SQL_USER as string;
    public static SqlPassword: string = SQL_PASSWORD as string;
}
import { injectable } from "inversify";
import LoggerBase from "./logger-base";
import * as winston from "winston";

@injectable()
export default class LoggerWinston extends LoggerBase {

    private logger = winston.createLogger({
        level: process.env.LOG_LEVEL
    });

    public error(message: string): void {
        this.logger.error(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public debug(message: string): void {
        this.logger.debug(message);
    }

}
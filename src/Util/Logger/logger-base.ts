import { injectable } from "inversify";

@injectable()
export default abstract class LoggerBase {
    
    public abstract error(message: string): void;
    public abstract warn(message: string): void;
    public abstract info(message: string): void;
    public abstract debug(message: string): void;

}
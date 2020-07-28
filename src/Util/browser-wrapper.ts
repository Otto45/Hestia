import { Browser, Page, launch, LaunchOptions } from "puppeteer";
import { injectable } from "inversify";

const LAUNCH_OPTIONS: LaunchOptions = {
    headless: true,
    slowMo: 200
}

@injectable()
export default class BrowserWrapper {
    private _browser: Browser | undefined;

    public async newPage(): Promise<Page> {
        if (this._browser === null || this._browser === undefined) {
            this._browser = await launch(LAUNCH_OPTIONS);
        }

        return await this._browser.newPage();
    }

    public async close(): Promise<void> {
        if (this._browser === null || this._browser === undefined){
            return;
        }

        await this._browser.close();
    }
}
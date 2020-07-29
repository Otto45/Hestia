import { Browser, Page, launch, LaunchOptions } from "puppeteer";
import { injectable } from "inversify";

const LAUNCH_OPTIONS_DEV: LaunchOptions = {
    headless: false,
    slowMo: 200
}

const LAUNCH_OPTIONS_PROD: LaunchOptions = {
    headless: true,
    args: ['--disable-gpu', '--disable-dev-shm-usage'],
    slowMo: 200
}

@injectable()
export default class BrowserWrapper {
    private _browser: Browser | undefined;

    public async newPage(): Promise<Page> {
        if (this._browser === null || this._browser === undefined) {
            this._browser = await launch(process.env.NODE_ENV === 'production' ? LAUNCH_OPTIONS_PROD : LAUNCH_OPTIONS_DEV);
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
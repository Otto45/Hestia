import { injectable } from 'inversify';
import { Page } from 'puppeteer';

@injectable()
export default class HumanSimulator {
    async clickElementOnPage(page: Page, querySelector: string) {
        // TODO: Click element on page specified by query selector argument,
        // with a randomized click speed (time between mousedown and mouseup)
        return page.click(querySelector);
    }
}

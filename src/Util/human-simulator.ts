import { Page } from 'puppeteer';

class HumanSimulator {
    async clickElementOnPage(page: Page, querySelector: string) {
        // TODO: Click element on page specified by query selector argument,
        // with a randomized click speed (time between mousedown and mouseup)
        return page.click(querySelector);
    }
}

export default HumanSimulator;
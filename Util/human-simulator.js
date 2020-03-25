class HumanSimulator {
    async clickElementOnPage(page, querySelector) {
        // TODO: Click element on page specified by query selector argument,
        // with a randomized click speed (time between mousedown and mouseup)
        return page.click(querySelector);
    }
}

module.exports = HumanSimulator;
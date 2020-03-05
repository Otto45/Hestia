// abstract class
class Site {
  constructor({ browser, url, userAgent, headers, humanSimulator }) {
      this.browser = browser;
      this.url = url;
      this.userAgent = userAgent;
      this.headers = headers;
      this.humanSimulator = humanSimulator;
      this.homeInfo = [];
  }

  // abstract protected methods
  async _searchForListOfHomes(page) {}
  async _searchHasResults(page) {}
  async _scrapeHomeInfoFromPage(page) {}
  async _searchResultsHasNextPage(page) {}
  async _navigateToNextPage(page) {}

  // public methods
  async searchForHomes(){
      const page = await this.browser.newPage();
      await page.setUserAgent(this.userAgent);
      await page.setExtraHTTPHeaders(this.headers);

      await this._searchForListOfHomes(page);

      if (!(await this._searchHasResults(page))) {
          return;
      }

      await this._scrapeHomeInfoFromPage(page);

      while (await this._searchResultsHasNextPage(page)) {
          await this._navigateToNextPage(page);
          await this._scrapeHomeInfoFromPage(page);
      }
  }
}

module.exports = Site;
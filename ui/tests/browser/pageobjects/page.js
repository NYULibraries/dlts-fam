/* global browser:false */

export default class Page {
    get baseUrl() {
        return browser.config.baseUrl;
    }

    get currentUrl() { return browser.getUrl(); }

    open( path ) {
        browser.url( path );
    }
};

/* global browser:false */

export default class Page {
    get baseUrl() {
        return browser.config.baseUrl;
    }

    get currentUrl() {
        return browser.getUrl();
    }

    get fullPath() {
        return this.baseUrl + this.path;
    }

    open( path ) {
        browser.url( this.path );
    }
};

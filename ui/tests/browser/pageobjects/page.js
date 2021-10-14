/* global browser:false */

export default class Page {
    get baseUrl() {
        return browser.config.baseUrl;
    }

    get baseUrlEad() {
        return browser.config.baseUrlEad;
    }

    get baseUrlFas() {
        return browser.config.baseUrlFas;
    }

    get currentUrl() {
        return browser.getUrl();
    }

    get fullPath() {
        return this.baseUrl + this.path;
    }

    open() {
        browser.url( this.path );
    }

    setWindowSize( width, height ) {
        browser.setWindowSize( width, height );
    }
};

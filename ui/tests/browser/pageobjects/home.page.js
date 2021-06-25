/* global browser:false $:false $$:false */

import Page from './page';

class Home extends Page {
    get baseUrl() {
        return browser.config.baseUrl;
    }

    get createAFindingAidOption() {
        return $( '#create-option' );
    }

    get manageInProcessFindingAidsOption() {
        return $( '#in-process-option' );
    }

    get managePublishedFindingAidsOption() {
        return $( '#published-option' );
    }

    open() {
        super.open( '/#/' );
    }
}

export default new Home();

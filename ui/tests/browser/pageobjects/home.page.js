/* global browser:false $:false $$:false */

import Page from './page';

import Navbar from '../pageobjects/classes/navbar';

class Home extends Page {
    constructor() {
        super();
        this.navbar = new Navbar();
    }

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

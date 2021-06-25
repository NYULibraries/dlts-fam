/* global browser:false $:false $$:false */

import Page from './page';

import Navbar from '../pageobjects/classes/navbar';

class Home extends Page {
    constructor() {
        super();
        this.navbar = new Navbar();
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

    get path() {
        return '#/';
    }
}

export default new Home();

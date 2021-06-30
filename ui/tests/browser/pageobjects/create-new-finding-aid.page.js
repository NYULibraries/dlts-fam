/* global browser:false $:false $$:false */

import Page from './page';

import Navbar from '../pageobjects/classes/navbar';

class CreateNewFindingAidPage extends Page {
    constructor() {
        super();
        this.navbar = new Navbar();
    }

    get cancelButton() {
        return $( '#cancel-button' );
    }

    get fileInput() {
        return $( 'div#upload-row' );
        // return $( 'div#upload-row .b-form-file input' );
    }

    get results() {
        return $( '#results-textarea' );
    }

    get path() {
        return '#/create';
    }

    get submitButton() {
        return $( '#submit-button' );
    }
}

export default new CreateNewFindingAidPage();

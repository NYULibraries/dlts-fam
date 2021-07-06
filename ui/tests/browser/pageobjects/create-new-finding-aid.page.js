/* global $:false */

import Page from './page';

import Navbar from '../pageobjects/classes/navbar';

import waitUntil from '../util/';

class CreateNewFindingAidPage extends Page {
    constructor() {
        super();
        this.navbar = new Navbar();
    }

    get cancelButton() {
        return $( '#cancel-button' );
    }

    get fileInput() {
        return $( 'div#upload-row .b-form-file input' );
    }

    get results() {
        return $( '#results-textarea' ).getValue();
    }

    get path() {
        return '#/create';
    }

    get submitButton() {
        return $( '#submit-button' );
    }

    uploadFile( path ) {
        this.fileInput.setValue( path );
    }
}

export default new CreateNewFindingAidPage();

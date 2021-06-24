/* global browser:false $:false $$:false */

import Page from './page';

class Login extends Page {
    get baseUrl() {
        return browser.config.baseUrl;
    }

    get feedback() {
        return $( '#feedback' ).getText();
    }

    get spinner() {
        return $( '#spinner' );
    }

    get title() {
        return browser.getTitle();
    };

    login( username, password ) {
        $( '#username' ).addValue( username );
        $( '#password' ).addValue( password );
        $(  '#sign-in-button' ).click();
        // Wait for the spinner to appear.
        this.spinner.waitForExist();
        // Wait for the spinner to disappear.
        this.spinner.waitForExist( { reverse : true } );
    }

    open() {
        super.open( '/#/login' );
    }
}

export default new Login();

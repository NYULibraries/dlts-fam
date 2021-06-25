/* global browser:false $:false $$:false */

import Page from './page';

class Login extends Page {
    static USERNAME = 'archivist';
    static PASSWORD = 'password';

    get feedback() {
        return $( '#feedback' ).getText();
    }

    get password() {
        return Login.PASSWORD;
    }

    get spinner() {
        return $( '#spinner' );
    }

    get title() {
        return browser.getTitle();
    };

    get username() {
        return Login.USERNAME;
    }

    login( usernameArg, passwordArg ) {
        let username, password;

        // If username and password are not provided, default to the correct credentials.
        // Note that can't test truthiness of usernameArg and passwordArg because
        // we want to cover the use case of sign-in with blank username and password.
        if ( arguments.length === 0 ) {
            username = Login.USERNAME;
            password = Login.PASSWORD;
        } else {
            username = usernameArg;
            password = passwordArg;
        }

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

/* global setup:false suite:false test:false */

import { assert } from 'chai';

import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';

suite( 'Login', function () {
    setup( function () {
        Logout.logout();
    } );

    test( 'Login with valid credentials takes user to Home', function () {
        Login.login();

        assert.equal( Login.currentUrl, Login.baseUrl + '#/' );
    } );

    suite( 'Login with invalid credentials results in the correct error message', function () {
        const INVALID_LOGIN_ERROR_MESSAGE = 'Invalid username and password combination';
        const INVALID_PASSWORD = Login.password + '[INVALID PASSWORD]';
        const INVALID_USERNAME = Login.username + '[INVALID USERNAME]';

        test( 'Valid username + invalid password', function () {
            Login.login( Login.username, INVALID_PASSWORD );
            assert.equal( Login.feedback, INVALID_LOGIN_ERROR_MESSAGE );
        } );

        test( 'Invalid username + valid password', function () {
            Login.login( INVALID_USERNAME, Login.password );
            assert.equal( Login.feedback, INVALID_LOGIN_ERROR_MESSAGE );
        } );

        test( 'Invalid username + invalid password', function () {
            Login.login( INVALID_USERNAME, INVALID_PASSWORD );
            assert.equal( Login.feedback, INVALID_LOGIN_ERROR_MESSAGE );
        } );

        test( 'Empty username + empty password', function () {
            Login.login( '', '' );
            assert.equal( Login.feedback, INVALID_LOGIN_ERROR_MESSAGE );
        } );
    } );
} );

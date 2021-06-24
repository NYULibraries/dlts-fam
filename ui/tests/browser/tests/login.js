/* global setup:false suite:false test:false */

import { assert } from 'chai';

import Login from '../pageobjects/login.page';

const USERNAME = 'archivist';
const PASSWORD = 'password';

suite( 'Login', function () {
    setup( function () {
        Login.open();
    } );

    suite( 'Login with invalid credentials results in the correct error message', function () {
        const INVALID_LOGIN_ERROR_MESSAGE = 'Invalid username and password combination';
        const INVALID_PASSWORD = '[INVALID PASSWORD]';
        const INVALID_USERNAME = '[INVALID USERNAME]';

        test( 'Valid username + invalid password', function () {
            Login.login( USERNAME, INVALID_PASSWORD );
            assert.equal( Login.feedback, INVALID_LOGIN_ERROR_MESSAGE );
        } );

        test( 'Invalid username + valid password', function () {
            Login.login( INVALID_USERNAME, PASSWORD );
            assert.equal( Login.feedback, INVALID_LOGIN_ERROR_MESSAGE );
        } );

        test( 'Invalid username + invalid password', function () {
            Login.login( INVALID_USERNAME, INVALID_PASSWORD );
            assert.equal( Login.feedback, INVALID_LOGIN_ERROR_MESSAGE );
        } );
    } );
} );

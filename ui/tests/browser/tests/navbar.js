/* global setup:false suite:false test:false */

import { assert } from 'chai';

import Home from '../pageobjects/home.page';
import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';
import { waitUntil } from '../util';

suite( `${ Home.constructor.name } Navbar`, function () {
    setup( function () {
        Login.login();
    } );

    teardown( function () {
        Logout.logout();
    } );

    test( `Current user is "${ Login.username }"`, function () {
        assert.equal( Home.navbar.currentUser.getText(), Login.username );
    } );

    test( 'Clicking "Home" navigates to / endpoint', function () {
        Home.navbar.create.click();
        assert.equal( Home.currentUrl, Home.baseUrl + '#/create' );
    } );

    test( 'Clicking "Create FA" navigates to /create endpoint', function () {
        Home.navbar.create.click();
        assert.equal( Home.currentUrl, Home.baseUrl + '#/create' );
    } );

    test( 'Clicking "In-process FAs" navigates to /in-process endpoint', function () {
        Home.navbar.inProcess.click();
        assert.equal( Home.currentUrl, Home.baseUrl + '#/in-process' );
    } );

    test( 'Clicking "Published FAs" navigates to /published endpoint', function () {
        Home.navbar.published.click();
        assert.equal( Home.currentUrl, Home.baseUrl + '#/published' );
    } );

    test( 'Clicking "Logout" logs out the user and navigates to Login', function () {
        Home.navbar.logout.click();

        assert.equal( Home.currentUrl, Logout.fullPath );

        const LOGOUT_IN_PROGRESS_MESSAGE = 'Logging out of the FAM...';
        waitUntil(
            () => Logout.feedback === LOGOUT_IN_PROGRESS_MESSAGE,
            `Logout page is not displaying "${ LOGOUT_IN_PROGRESS_MESSAGE }"`,
        );

        // Multiple spaces are apparently compressed into a single space in the $(...).getText() value.
        const LOGOUT_COMPLETE_MESSAGE = 'Logout complete.  Thank you, goodbye...'.replace( /\s\s+/g, ' ' );
        waitUntil(
            () => Logout.feedback === LOGOUT_COMPLETE_MESSAGE,
            `Logout page is not displaying "${ LOGOUT_COMPLETE_MESSAGE }"`,
        );

        waitUntil(
            () => Home.currentUrl === Login.fullPath,
            'User was not redirected to Login',
        );
    } );
} );

/* global setup:false suite:false test:false */

import { assert } from 'chai';

import Home from '../pageobjects/home.page';
import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';
import { waitUntil } from '../util';

testNavbar( Home );

function testNavbar( component ) {
    setup( function () {
        Login.login();

        // TODO: REMOVE THIS AFTER FINISHED WRITING TESTS AGAINST MOCKUP 2
        // This is a temporary helper function for doing the initial test development against
        // mockup 2.  Calling browser.url(...) against the mockup causes the SPA simulation
        // to reload, which effectively logs out the user.
        navigateToComponent( component );
    } );

    teardown( function () {
        Logout.logout();
    } );

    suite( `${ component.constructor.name } Navbar`, function () {
        test( `Current user is "${ Login.username }"`, function () {
            assert.equal( Home.navbar.currentUser.getText(), Login.username );
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
}

// TODO: REMOVE THIS AFTER FINISHED WRITING TESTS AGAINST MOCKUP 2
// This is a temporary helper function for doing the initial test development against
// mockup 2.  Calling browser.url(...) against the mockup causes the SPA simulation
// to reload, which effectively logs out the user.
function navigateToComponent( component ) {
    switch ( component.constructor.name ) {
    case Home.constructor.name:
        component.navbar.home.click();
        break;
    }
}

export {
    testNavbar,
};

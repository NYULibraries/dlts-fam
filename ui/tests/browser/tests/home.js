/* global setup:false suite:false test:false */

import { assert } from 'chai';

import Home from '../pageobjects/home.page';
import Login from '../pageobjects/login.page';

suite( 'Home', function () {
    setup( function () {
        Login.open();
        Login.login();
    } );

    suite( 'Navbar', function () {
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
            assert.equal( Home.currentUrl, Home.baseUrl + '#/login' );
        } );
    } );

    test( 'Clicking "Create a finding aid" navigates to /create endpoint', function () {
        Home.createAFindingAidOption.click();
        assert.equal( Home.currentUrl, Home.baseUrl + '#/create' );
    } );

    test( 'Clicking "Manage in-process finding aids" navigates to /in-process endpoint', function () {
        Home.manageInProcessFindingAidsOption.click();
        assert.equal( Home.currentUrl, Home.baseUrl + '#/in-process' );
    } );

    test( 'Clicking "Manage published finding aids" navigates to /published endpoint', function () {
        Home.managePublishedFindingAidsOption.click();
        assert.equal( Home.currentUrl, Home.baseUrl + '#/published' );
    } );
} );

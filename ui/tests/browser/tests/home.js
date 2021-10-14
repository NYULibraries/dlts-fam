/* global setup:false suite:false test:false */

import { assert } from 'chai';

import Home from '../pageobjects/home.page';
import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';

suite( 'Home', function () {
    suiteSetup( function () {
        Home.setWindowSize( 1280, 720 );
    } );

    setup( function () {
        Login.login();
    } );

    teardown( function () {
        Logout.logout();
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

/* global setup:false suite:false test:false */

import { assert } from 'chai';

import Home from '../pageobjects/home.page';
import Login from '../pageobjects/login.page';

suite( 'Home', function () {
    setup( function () {
        Login.open();
        Login.login();
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

/* global setup:false suite:false test:false */

import { assert } from 'chai';

import CreateNewFindingAid from '../pageobjects/create-new-finding-aid.page';
import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';

suite( 'Create New Finding Aid', function () {
    setup( function () {
        Login.login();
        CreateNewFindingAid.open();
    } );

    teardown( function () {
        Logout.logout();
    } );

    test( 'Submit button is disabled on first load', function() {
        assert.isFalse( CreateNewFindingAid.submitButton.isEnabled() );
    } );
} );

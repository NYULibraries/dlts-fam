/* global setup:false suite:false test:false */

import { assert } from 'chai';

import ManageInProcessFindingAids from '../pageobjects/manage-in-process-finding-aids.page';
import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';

suite( 'Manage In-process Finding Aids', function () {
    setup( function () {
        Login.login();
        ManageInProcessFindingAids.open();
    } );

    teardown( function () {
        Logout.logout();
    } );

    test( 'test', function () {
        assert( true );
    } );
} );

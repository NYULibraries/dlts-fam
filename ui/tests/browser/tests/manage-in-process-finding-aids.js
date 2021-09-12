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
        const resultsIds = [];
        const snapshots = [];

        snapshots.push( ManageInProcessFindingAids.resultsSnapshot() );

        ManageInProcessFindingAids.setResultsPerPage( 50 );
        snapshots.push( ManageInProcessFindingAids.resultsSnapshot() );
        resultsIds.push( ManageInProcessFindingAids.getResultsIdForCurrentOptions() );

        ManageInProcessFindingAids.clickPageNavigationLink( 2 );
        snapshots.push( ManageInProcessFindingAids.resultsSnapshot() );
        resultsIds.push( ManageInProcessFindingAids.getResultsIdForCurrentOptions() );

        ManageInProcessFindingAids.filterById( 'a b c ! % *' );
        snapshots.push( ManageInProcessFindingAids.resultsSnapshot() );
        resultsIds.push( ManageInProcessFindingAids.getResultsIdForCurrentOptions() );

        ManageInProcessFindingAids.clickSortByTimestamp();
        snapshots.push( ManageInProcessFindingAids.resultsSnapshot() );
        resultsIds.push( ManageInProcessFindingAids.getResultsIdForCurrentOptions() );

        ManageInProcessFindingAids.clickSortByTimestamp();
        snapshots.push( ManageInProcessFindingAids.resultsSnapshot() );
        resultsIds.push( ManageInProcessFindingAids.getResultsIdForCurrentOptions() );

        ManageInProcessFindingAids.filterByRepository(
            'Akkasah: Center for Photography (NYU Abu Dhabi)',
        );
        snapshots.push( ManageInProcessFindingAids.resultsSnapshot() );
        resultsIds.push( ManageInProcessFindingAids.getResultsIdForCurrentOptions() );

        assert( true );
    } );
} );

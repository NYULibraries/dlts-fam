/* global setup:false suite:false test:false */

import fs from 'fs';

import { assert } from 'chai';

import ManageInProcessFindingAids from '../pageobjects/manage-in-process-finding-aids.page';
import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';

import {
    clearActualFilesDirectory,
    clearDiffFilesDirectory,
    diffActualVsGoldenAndReturnMessage,
    getActualFilePath,
    getGoldenFilePath,
    jsonStableStringify,
    updateGoldenFiles,
    waitUntil,
    SUITE_NAME,
} from '../util';

suite( 'Manage In-process Finding Aids - UI', function () {
    suiteSetup( function () {
        clearActualFilesDirectory( SUITE_NAME.manageInProcessFindingAids );
        clearDiffFilesDirectory( SUITE_NAME.manageInProcessFindingAids );

        Login.login();
        ManageInProcessFindingAids.open();
    } );

    setup( function () {
        ManageInProcessFindingAids.reset();
    } );

    suiteTeardown( function () {
        Logout.logout();
    } );

    suite( 'ID filter', function () {
        [ 'a', 'art', 'mc_3' ].forEach( filterValue => {
            test( `Correct results for ID filter = "${ filterValue }"`, function () {
                ManageInProcessFindingAids.filterById( filterValue );
                const { ok, message } = writeSnapshotToActualFileAndCompareToGolden();

                assert( ok, message );
            } );
        } );
    } );

    suite( 'Repository filter', function () {
        [
            'Fales Library and Special Collections',
            'New-York Historical Society',
            'NYU Abu Dhabi, Archives and Special Collections',
        ].forEach( filterValue => {
            test( `Correct results for Repository filter = "${ filterValue }"`, function () {
                ManageInProcessFindingAids.filterByRepository( filterValue );
                const { ok, message } = writeSnapshotToActualFileAndCompareToGolden();

                assert( ok, message );
            } );
        } );
    } );

    suite( 'ID and Repository filters together', function () {
        [
            { id : 3,       repository : 'New York University Archives' },
            { id : 2016,    repository : 'Center for Brooklyn History' },
            { id : 'nysrg', repository : 'New-York Historical Society' },
        ].forEach( filterValues => {
            const id = filterValues.id;
            const repository = filterValues.repository;
            test( `Correct results for ID filter = "${ id }" and Repository filter = ${ repository }`, function () {
                ManageInProcessFindingAids.filterById( id );
                ManageInProcessFindingAids.filterByRepository( repository );
                const { ok, message } = writeSnapshotToActualFileAndCompareToGolden();

                assert( ok, message );
            } );
        } );
    } );

    suite( 'Per page dropdown', function () {
        [ 10, 25, 50, 100 ].forEach( perPageNumber => {
            test( `Sets correct number of results per page for value "${ perPageNumber }"`, function () {
                ManageInProcessFindingAids.setResultsPerPage( perPageNumber );
                const { ok, message } = writeSnapshotToActualFileAndCompareToGolden();

                assert( ok, message );
            } );
        } );
    } );

    suite( 'Page navigation', function () {
        test( 'Clicking on go to first page and go to last page controls takes user to the correct pages', function () {
            ManageInProcessFindingAids.clickGotoLastPage();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManageInProcessFindingAids.clickGotoFirstPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );

        test( 'Clicking on page links 2, 3, 4, 5 takes user to the correct pages', function () {
            ManageInProcessFindingAids.clickPageNavigationLink( '2' );
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManageInProcessFindingAids.clickPageNavigationLink( '3' );
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManageInProcessFindingAids.clickPageNavigationLink( '4' );
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManageInProcessFindingAids.clickPageNavigationLink( '5' );
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );

        test( 'Clicking on next page 3 times then previous page 3 times produces the correct pages', function () {
            ManageInProcessFindingAids.clickGotoNextPage();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManageInProcessFindingAids.clickGotoNextPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManageInProcessFindingAids.clickGotoNextPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManageInProcessFindingAids.clickGotoPreviousPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManageInProcessFindingAids.clickGotoPreviousPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManageInProcessFindingAids.clickGotoPreviousPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );
    } );

    suite( 'Sort controls', function () {
        test( 'Clicking ID sort produces correct ascending and descending ordering', function () {
            ManageInProcessFindingAids.clickSortById();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManageInProcessFindingAids.clickSortById();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );

        test( 'Clicking Repository sort produces correct ascending and descending ordering', function () {
            ManageInProcessFindingAids.clickSortByRepository();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManageInProcessFindingAids.clickSortByRepository();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );

        test( 'Clicking Timestamp sort produces correct ascending and descending ordering', function () {
            ManageInProcessFindingAids.clickSortByTimestamp();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManageInProcessFindingAids.clickSortByTimestamp();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );
    } );

    suite( 'Open/close detail rows', function () {
        // Every single row regardless of whether it is currently displayed
        // remembers its detail row toggle state, which makes detail row toggle
        // state difficult to reset using ManageInProcessFindingAids.reset().
        setup( function () {
            Logout.logout();
            Login.login();
            ManageInProcessFindingAids.open();
        } );

        test( 'Clicking toggle details control opens/closes detail row', function () {
            const eadId = 'ad_mc_012';
            ManageInProcessFindingAids.clickToggleDetailsButton( eadId );
            assert(
                ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking the toggle details control did not open the detail row for ${ eadId }`,
            );

            ManageInProcessFindingAids.clickToggleDetailsButton( eadId );
            assert(
                ! ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking the toggle details control did not close the detail row for ${ eadId }`,
            );
        } );

        test( 'Clicking ID opens/closes detail row', function () {
            const eadId = 'ad_mc_012';
            ManageInProcessFindingAids.clickIdCellForRow( eadId );
            assert(
                ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ eadId }" did not open the detail row for ${ eadId }`,
            );

            ManageInProcessFindingAids.clickIdCellForRow( eadId );
            assert(
                ! ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ eadId }" did not close the detail row for ${ eadId }`,
            );
        } );

        test( 'Clicking repository opens/closes detail row', function () {
            const eadId = 'ad_mc_012';
            const repository = ManageInProcessFindingAids.cellForRow( eadId, 'Repository' ).getText();

            ManageInProcessFindingAids.clickRepositoryCellForRow( eadId );
            assert(
                ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ repository }" did not open the detail row for ${ eadId }`,
            );

            ManageInProcessFindingAids.clickRepositoryCellForRow( eadId );
            assert(
                ! ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ repository }" did not close the detail row for ${ eadId }`,
            );
        } );

        test( 'Clicking timestamp opens/closes detail row', function () {
            const eadId = 'ad_mc_012';
            const timestamp = ManageInProcessFindingAids.cellForRow( eadId, 'Timestamp' ).getText();

            ManageInProcessFindingAids.clickRepositoryCellForRow( eadId );
            assert(
                ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ timestamp }" did not open the detail row for ${ eadId }`,
            );

            ManageInProcessFindingAids.clickRepositoryCellForRow( eadId );
            assert(
                ! ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ timestamp }" did not close the detail row for ${ eadId }`,
            );
        } );

        test( 'Opening and multiple detail rows works correctly', function () {
            // Chose three that were near the top so that the last would not be
            // pushed off the screen after the first two were opened.
            const eadIds = [
                'ad_mc_012',
                'alwan',
                '2018_006',
            ];

            eadIds.forEach( eadId => {
                ManageInProcessFindingAids.clickToggleDetailsButton( eadId );
                assert(
                    ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                    `Clicking toggle details control did not open the detail row for ${ eadId }`,
                );
            } );

            eadIds.reverse().forEach( eadId => {
                ManageInProcessFindingAids.clickToggleDetailsButton( eadId );
                assert(
                    ! ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
                    `Clicking toggle details control did not close the detail row for ${ eadId }`,
                );
            } );
        } );
    } );

    // Don't know of a way to detect that a new tab was opened and that it loaded
    // the correct preview URL.
    test( 'View preview buttons have the correct hrefs', function () {
        const eadId = 'ad_mc_012';

        ManageInProcessFindingAids.clickToggleDetailsButton( eadId );

        assert.equal(
            ManageInProcessFindingAids.viewFindingAidPreviewButtonHrefForRow( 'ad_mc_012' ),
            '#/preview/finding-aid/akkasah/ad_mc_012',
            '"View finding aid preview" button does not have the correct href',
        );

        assert.equal(
            ManageInProcessFindingAids.viewEadFilePreviewButtonHrefForRow( 'ad_mc_012' ),
            '#/preview/ead/akkasah/ad_mc_012',
            '"View EAD file preview" button does not have the correct href',
        );

        // Custom teardown
        ManageInProcessFindingAids.clickToggleDetailsButton( eadId );
        assert(
            ! ManageInProcessFindingAids.detailsRow( eadId ).isExisting(),
            `Clicking toggle details control did not close the detail row for ${ eadId }`,
        );
    } );

    suite( 'Publish finding aid', function () {
        const eadId = 'ad_mc_012';

        test( 'Clicking Cancel on "Confirm publication" modal cancels publication', function () {
            ManageInProcessFindingAids.clickToggleDetailsButton( eadId );
            ManageInProcessFindingAids.clickPublishFindingAidButtonForRow( eadId );

            assert(
                ManageInProcessFindingAids.confirmPublishModal.element.isExisting(),
                `"Confirm publication" modal was not displayed after clicking "Publish finding aid" button for ${ eadId }`,
            );

            ManageInProcessFindingAids.confirmPublishModal.button( 'Cancel' ).click();

            // Changed this from an assert() because apparently the modal wasn't
            // ceasing to exist fast enough.
            waitUntil(
                () => ! ManageInProcessFindingAids.confirmPublishModal.element.isExisting(),
                '"Confirm publication" modal was not dismissed after clicking "Cancel" button',
            );
        } );
    } );
} );

function writeSnapshotToActualFileAndCompareToGolden( goldenArg ) {
    const snapshot = ManageInProcessFindingAids.resultsSnapshot();
    const resultsId = ManageInProcessFindingAids.getResultsIdForCurrentOptions();

    const actualFile = getActualFilePath( SUITE_NAME.manageInProcessFindingAids, resultsId );
    const goldenFile = getGoldenFilePath( SUITE_NAME.manageInProcessFindingAids, resultsId );

    const stringifiedSnapshot = jsonStableStringify( snapshot );

    let ok, message;
    if ( updateGoldenFiles() ) {
        fs.writeFileSync( goldenFile, stringifiedSnapshot );

        console.log( `Updated golden file ${ goldenFile }` );

        ok = true;
    } else {
        const golden            = goldenArg || require( goldenFile );
        const stringifiedGolden = jsonStableStringify( golden );

        fs.writeFileSync( actualFile, stringifiedSnapshot );

        ok = ( stringifiedSnapshot === stringifiedGolden );
        if ( ! ok ) {
            message = diffActualVsGoldenAndReturnMessage( SUITE_NAME.manageInProcessFindingAids, actualFile, goldenFile, resultsId );
        }
    }

    return {
        ok,
        message,
    };
}

// -----------------------------------------------------------------------------

// These are useful function for generating tests from golden files, which is an
// approached used by the NYU Press sites ENM and Open Square from which these
// browser tests were originally based.  Keeping them around here because they
// were the result of refactoring done while working on this project and don't
// exist in ENM and Open Square.  Later it became apparent that a golden files
// test loop might not be the most appropriate testing approach for this component,
// so the loop has been removed, but these function are being kept here for the
// time being.
// TODO: Do these refactorings in ENM and Open Square, or else extract them to
// shared library code, then delete the functions from this file.

function getTestTitleFromGoldenFile( golden ) {
    return 'Filter options { ' +
           ( golden.ui.idFilter ? ` id filter=${ golden.ui.idFilter };` : ' no id filter;' ) +
           ` page number=${ golden.ui.pageNumber };` +
           ` repository filter=${ golden.ui.repositoryFilter };` +
           ` results per page=${ golden.ui.resultsPerPage };` +
           ( golden.ui.sortField ? ` sort=${ golden.ui.sortField } ${ golden.ui.sortDirection }` : ' no specified sort' ) +
           ' } produces the correct header and finding aids results';
}

function setUiOptionsFromGoldenFile( golden ) {
    const idFilter = golden.ui.idFilter;
    const pageNumber = golden.ui.pageNumber;
    const repositoryFilter = golden.ui.repositoryFilter;
    const resultsPerPage = golden.ui.resultsPerPage;
    const sortDirection = golden.ui.sort ? golden.ui.sort.direction : null;
    const sortField = golden.ui.sort ? golden.ui.sort.field : null;

    if ( idFilter ) {
        ManageInProcessFindingAids.filterById( idFilter );
    }

    if ( pageNumber ) {
        ManageInProcessFindingAids.clickPageNavigationLink( pageNumber );
    }

    if ( repositoryFilter ) {
        ManageInProcessFindingAids.filterByRepository( repositoryFilter );
    }

    if ( resultsPerPage ) {
        ManageInProcessFindingAids.setResultsPerPage( resultsPerPage );
    }

    if ( sortField ) {
        const currentSort = ManageInProcessFindingAids.sort;
        if ( currentSort.field !== sortField ) {
            ManageInProcessFindingAids.clickSortBy( sortField );
            // There is only toggling, so click again if the sort is not right.
            if ( currentSort.direction !== sortDirection ) {
                ManageInProcessFindingAids.clickSortBy( sortField );
            }
        }
    }
}

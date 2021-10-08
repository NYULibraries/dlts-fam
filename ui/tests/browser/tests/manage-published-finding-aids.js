/* global setup:false suite:false test:false */

import fs from 'fs';

import { assert } from 'chai';

import ManagePublishedFindingAids from '../pageobjects/manage-published-finding-aids.page';
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

suite( 'Manage Published Finding Aids - UI', function () {
    suiteSetup( function () {
        clearActualFilesDirectory( SUITE_NAME.managePublishedFindingAids );
        clearDiffFilesDirectory( SUITE_NAME.managePublishedFindingAids );

        Login.login();
        ManagePublishedFindingAids.open();
    } );

    setup( function () {
        ManagePublishedFindingAids.reset();
        // Wait until the table is populated.
        waitUntil(
            () => ManagePublishedFindingAids.rowExists( 'ad_mc_002' ),
            'Row for "ad_mc_002" does not exist.  The table has not been populated.',
            { timeout : 60000 },
        );
    } );

    suiteTeardown( function () {
        Logout.logout();
    } );

    suite( 'ID filter', function () {
        [ 'a', 'diner', 'grey_gallery' ].forEach( filterValue => {
            test( `Correct results for ID filter = "${ filterValue }"`, function () {
                ManagePublishedFindingAids.filterById( filterValue );
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
                ManagePublishedFindingAids.filterByRepository( filterValue );
                const { ok, message } = writeSnapshotToActualFileAndCompareToGolden();

                assert( ok, message );
            } );
        } );
    } );

    suite( 'ID and Repository filters together', function () {
        [
            { id : 3,         repository : 'New York University Archives' },
            { id : '2015_11', repository : 'Center for Brooklyn History' },
            { id : 'bible',   repository : 'New-York Historical Society' },
        ].forEach( filterValues => {
            const id = filterValues.id;
            const repository = filterValues.repository;
            test( `Correct results for ID filter = "${ id }" and Repository filter = ${ repository }`, function () {
                ManagePublishedFindingAids.filterById( id );
                ManagePublishedFindingAids.filterByRepository( repository );
                const { ok, message } = writeSnapshotToActualFileAndCompareToGolden();

                assert( ok, message );
            } );
        } );
    } );

    suite( 'Per page dropdown', function () {
        [ 10, 25, 50, 100 ].forEach( perPageNumber => {
            test( `Sets correct number of results per page for value "${ perPageNumber }"`, function () {
                ManagePublishedFindingAids.setResultsPerPage( perPageNumber );
                const { ok, message } = writeSnapshotToActualFileAndCompareToGolden();

                assert( ok, message );
            } );
        } );
    } );

    suite( 'Page navigation', function () {
        test( 'Clicking on go to first page and go to last page controls takes user to the correct pages', function () {
            ManagePublishedFindingAids.clickGotoLastPage();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManagePublishedFindingAids.clickGotoFirstPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );

        test( 'Clicking on page links 2, 3, 4, 5 takes user to the correct pages', function () {
            ManagePublishedFindingAids.clickPageNavigationLink( '2' );
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManagePublishedFindingAids.clickPageNavigationLink( '3' );
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManagePublishedFindingAids.clickPageNavigationLink( '4' );
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManagePublishedFindingAids.clickPageNavigationLink( '5' );
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );

        test( 'Clicking on next page 3 times then previous page 3 times produces the correct pages', function () {
            ManagePublishedFindingAids.clickGotoNextPage();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManagePublishedFindingAids.clickGotoNextPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManagePublishedFindingAids.clickGotoNextPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManagePublishedFindingAids.clickGotoPreviousPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManagePublishedFindingAids.clickGotoPreviousPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );

            ManagePublishedFindingAids.clickGotoPreviousPage();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );
    } );

    suite( 'Sort controls', function () {
        test( 'Clicking ID sort produces correct ascending and descending ordering', function () {
            ManagePublishedFindingAids.clickSortById();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManagePublishedFindingAids.clickSortById();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );

        test( 'Clicking Repository sort produces correct ascending and descending ordering', function () {
            ManagePublishedFindingAids.clickSortByRepository();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManagePublishedFindingAids.clickSortByRepository();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );

        test( 'Clicking Timestamp sort produces correct ascending and descending ordering', function () {
            ManagePublishedFindingAids.clickSortByTimestamp();
            let { ok, message } = writeSnapshotToActualFileAndCompareToGolden();
            assert( ok, message );

            ManagePublishedFindingAids.clickSortByTimestamp();
            ( { ok, message } = writeSnapshotToActualFileAndCompareToGolden() );
            assert( ok, message );
        } );
    } );

    suite( 'Open/close detail rows', function () {
        // Chose three that were near the top so that the last would not be
        // pushed off the screen after the first two were opened.
        const eadIds = [
            'ad_mc_002',
            'ad_mc_011',
            'ad_mc_012',
        ];

        // Every single row regardless of whether it is currently displayed
        // remembers its detail row toggle state, which makes detail row toggle
        // state difficult to reset using ManagePublishedFindingAids.reset().
        setup( function () {
            Logout.logout();
            Login.login();
            ManagePublishedFindingAids.open();
        } );

        teardown( function () {
            eadIds.forEach( eadId => {
                ManagePublishedFindingAids.closeDetailsRowIfOpen( eadId );
            } );
        } );

        test( 'Clicking toggle details control opens/closes detail row', function () {
            const eadId = 'ad_mc_002';
            ManagePublishedFindingAids.clickToggleDetailsButton( eadId );
            assert(
                ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking the toggle details control did not open the detail row for ${ eadId }`,
            );

            ManagePublishedFindingAids.clickToggleDetailsButton( eadId );
            assert(
                ! ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking the toggle details control did not close the detail row for ${ eadId }`,
            );
        } );

        test( 'Clicking ID opens/closes detail row', function () {
            const eadId = 'ad_mc_002';
            ManagePublishedFindingAids.clickIdCellForRow( eadId );
            assert(
                ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ eadId }" did not open the detail row for ${ eadId }`,
            );

            ManagePublishedFindingAids.clickIdCellForRow( eadId );
            assert(
                ! ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ eadId }" did not close the detail row for ${ eadId }`,
            );
        } );

        test( 'Clicking repository opens/closes detail row', function () {
            const eadId = 'ad_mc_002';
            const repository = ManagePublishedFindingAids.cellForRow( eadId, 'Repository' ).getText();

            ManagePublishedFindingAids.clickRepositoryCellForRow( eadId );
            assert(
                ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ repository }" did not open the detail row for ${ eadId }`,
            );

            ManagePublishedFindingAids.clickRepositoryCellForRow( eadId );
            assert(
                ! ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ repository }" did not close the detail row for ${ eadId }`,
            );
        } );

        test( 'Clicking timestamp opens/closes detail row', function () {
            const eadId = 'ad_mc_002';
            const timestamp = ManagePublishedFindingAids.cellForRow( eadId, 'Timestamp' ).getText();

            ManagePublishedFindingAids.clickRepositoryCellForRow( eadId );
            assert(
                ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ timestamp }" did not open the detail row for ${ eadId }`,
            );

            ManagePublishedFindingAids.clickRepositoryCellForRow( eadId );
            assert(
                ! ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                `Clicking "${ timestamp }" did not close the detail row for ${ eadId }`,
            );
        } );

        test( 'Opening and multiple detail rows works correctly', function () {
            eadIds.forEach( eadId => {
                ManagePublishedFindingAids.clickToggleDetailsButton( eadId );
                assert(
                    ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                    `Clicking toggle details control did not open the detail row for ${ eadId }`,
                );
            } );

            eadIds.reverse().forEach( eadId => {
                ManagePublishedFindingAids.clickToggleDetailsButton( eadId );
                assert(
                    ! ManagePublishedFindingAids.detailsRow( eadId ).isExisting(),
                    `Clicking toggle details control did not close the detail row for ${ eadId }`,
                );
            } );
        } );
    } );

    // Don't know of a way to detect that a new tab was opened and that it loaded
    // the correct preview URL.
    test( 'View buttons have the correct hrefs', function () {
        const repositoryCode = 'akkasah';
        const eadId = 'ad_mc_002';

        // Custom setup
        ManageInProcessFindingAids.closeDetailsRowIfOpen( eadId );

        ManagePublishedFindingAids.clickToggleDetailsButton( eadId );

        assert.equal(
            ManagePublishedFindingAids.viewFindingAidButtonHrefForRow( 'ad_mc_002' ),
            `${ ManagePublishedFindingAids.baseUrlFas }${ repositoryCode }/${ eadId }`,
            '"View finding aid" button does not have the correct href',
        );

        assert.equal(
            ManagePublishedFindingAids.viewEadFilePreviewButtonHrefForRow( 'ad_mc_002' ),
            `${ ManagePublishedFindingAids.baseUrlEad }${ repositoryCode }/${ eadId }`,
            '"View EAD file" button does not have the correct href',
        );

        // Custom teardown
        ManagePublishedFindingAids.closeDetailsRowIfOpen( eadId );
    } );

    suite( 'Delete published finding aid', function () {
        // This needs to be different from the eadId used for the publish finding aid tests.
        const eadId = 'ad_mc_007';

        setup( function () {
            ManagePublishedFindingAids.closeDetailsRowIfOpen( eadId );
        } );

        teardown( function () {
            ManagePublishedFindingAids.closeDetailsRowIfOpen( eadId );
        } );

        test( 'Clicking Cancel on "Confirm deletion" modal cancels deletion', function () {
            ManagePublishedFindingAids.clickToggleDetailsButton( eadId );
            ManagePublishedFindingAids.clickDeletePublishedFindingAidButtonForRow( eadId );

            assert(
                ManagePublishedFindingAids.confirmDeletionModal.element.isExisting(),
                `"Confirm deletion" modal was not displayed after clicking "Delete published finding aid" button for ${ eadId }`,
            );

            ManagePublishedFindingAids.confirmDeletionModal.button( 'Cancel' ).click();

            // Changed this from an assert() because apparently the modal wasn't
            // ceasing to exist fast enough.
            waitUntil(
                () => ! ManagePublishedFindingAids.confirmDeletionModal.element.isExisting(),
                '"Confirm deletion" modal was not dismissed after clicking "Cancel" button',
            );
        } );

        test( 'Deletion of published finding aid works correctly', function () {
            ManagePublishedFindingAids.clickToggleDetailsButton( eadId );
            ManagePublishedFindingAids.clickDeletePublishedFindingAidButtonForRow( eadId );

            assert(
                ManagePublishedFindingAids.confirmDeletionModal.element.isExisting(),
                `"Confirm deletion" modal was not displayed after clicking "Delete published finding aid" button for ${ eadId }`,
            );

            ManagePublishedFindingAids.confirmDeletionModal.button( 'Delete' ).click();

            waitUntil(
                () => ManagePublishedFindingAids.deletionCompletedModal.element.isExisting(),
                `"Deletion completed" modal was not displayed after clicking "Delete" button for ${ eadId }`,
            );

            // TODO: Reinstate if necessary
            // Not sure why, but the click of the OK button fails if this is not here.
            // Apparently ManagePublishedFindingAids.deletionCompletedModal.element.isExisting()
            // is not enough.  Weird, considering this problem doesn't happen with the OK
            // button on the "Publication complete" modal.
            // waitUntil(
            //     () => ManagePublishedFindingAids.deletionCompletedModal.button( 'OK' ).isClickable(),
            //     'OK button on "Deletion completed" modal is not clickable.',
            // );

            ManagePublishedFindingAids.deletionCompletedModal.button( 'OK' ).click();

            // Changed this from an assert() because apparently the modal wasn't
            // ceasing to exist fast enough.
            // waitUntil(
            //     () => ! ManagePublishedFindingAids.deletionCompletedModal.element.isExisting(),
            //     '"Deletion completed" modal was not dismissed after clicking "OK" button',
            // );

            assert(
                ! ManagePublishedFindingAids.deletionCompletedModal.element.isExisting(),
                '"Deletion completed" modal was not dismissed after clicking "OK" button',
            );
            assert(
                ! ManagePublishedFindingAids.row( eadId ).isExisting(),
                `${ eadId } is still in the Published FAs table`,
            );
        } );
    } );
} );

function writeSnapshotToActualFileAndCompareToGolden( goldenArg ) {
    const snapshot = ManagePublishedFindingAids.resultsSnapshot();
    const resultsId = ManagePublishedFindingAids.getResultsIdForCurrentOptions();

    const actualFile = getActualFilePath( SUITE_NAME.managePublishedFindingAids, resultsId );
    const goldenFile = getGoldenFilePath( SUITE_NAME.managePublishedFindingAids, resultsId );

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
            message = diffActualVsGoldenAndReturnMessage( SUITE_NAME.managePublishedFindingAids, actualFile, goldenFile, resultsId );
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
        ManagePublishedFindingAids.filterById( idFilter );
    }

    if ( pageNumber ) {
        ManagePublishedFindingAids.clickPageNavigationLink( pageNumber );
    }

    if ( repositoryFilter ) {
        ManagePublishedFindingAids.filterByRepository( repositoryFilter );
    }

    if ( resultsPerPage ) {
        ManagePublishedFindingAids.setResultsPerPage( resultsPerPage );
    }

    if ( sortField ) {
        const currentSort = ManagePublishedFindingAids.sort;
        if ( currentSort.field !== sortField ) {
            ManagePublishedFindingAids.clickSortBy( sortField );
            // There is only toggling, so click again if the sort is not right.
            if ( currentSort.direction !== sortDirection ) {
                ManagePublishedFindingAids.clickSortBy( sortField );
            }
        }
    }
}

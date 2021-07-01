/* global setup:false suite:false test:false */

import { assert } from 'chai';

import CreateNewFindingAid from '../pageobjects/create-new-finding-aid.page';
import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';

import { waitUntil } from '../util';

const path = require( 'path' );

const MC_100_EAD_FILE_PATH =
    path.join( __dirname, '../fixtures/mc_100.xml' );

const SUCCESSFUL_UPLOAD_OF_VALID_EAD_FILE_RESULTS_TEXT =
    `Uploading EAD file mc_100.xml...
Upload complete.
Validating EAD file...
File validation is complete.

Click Submit to move this file to In-Process FAs and to create a preview finding aid for:

EAD ID: mc_100
REPOSITORY: New York University Archives

`;

const TIMESTAMP_PATTERN = '[MONTH]/[DAY]/[YEAR] [HOUR]:[MINUTE] [AM/PM]';
const SUCCESSFUL_CREATION_OF_IN_PROCESS_FINDING_AID_RESULTS_TEXT =
    SUCCESSFUL_UPLOAD_OF_VALID_EAD_FILE_RESULTS_TEXT +
    `Creating in-process finding aid...
New in-process finding aid created with timestamp ${ TIMESTAMP_PATTERN }.

Proceed to In-process FAs to preview the new EAD file and finding aid.

`;

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

    test( 'Uploading a valid EAD file and clicking Submit creates an in-process finding aid', function () {
        CreateNewFindingAid.uploadFile( MC_100_EAD_FILE_PATH );

        waitUntil(
            () => CreateNewFindingAid.submitButton.isEnabled(),
            'Submit button is enabled',
            {
                timeout    : 10000,
            },
        );

        assert.equal(
            CreateNewFindingAid.results,
            SUCCESSFUL_UPLOAD_OF_VALID_EAD_FILE_RESULTS_TEXT,
        );

        CreateNewFindingAid.submitButton.click();

        waitUntil(
            () => ! CreateNewFindingAid.submitButton.isEnabled(),
            '',
            {
                timeout : 10000,
            },
        );

        assert.equal(
            CreateNewFindingAid.results.replace(
                /\d{1,2}\/\d{1,2}\/\d{1,4} \d{1,2}:\d{2} (am|pm)/,
                TIMESTAMP_PATTERN,
            ),
            SUCCESSFUL_CREATION_OF_IN_PROCESS_FINDING_AID_RESULTS_TEXT,
        );
    } );
} );

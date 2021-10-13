/* global setup:false suite:false test:false */

import { assert } from 'chai';

import CreateNewFindingAid from '../pageobjects/create-new-finding-aid.page';
import Login from '../pageobjects/login.page';
import Logout from '../pageobjects/logout.page';

import { waitUntil } from '../util';

const path = require( 'path' );

const INVALID_XML_FILE_PATH =
    path.join( __dirname, '../fixtures/invalid-xml.xml' );
const MC_100_EADID_CONFLICT_EAD_FILE_PATH =
    path.join( __dirname, '../fixtures/mc_100-eadid-conflict.xml' );
const MC_100_EAD_FILE_PATH =
    path.join( __dirname, '../fixtures/mc_100.xml' );
const MC_100_INVALID_EADID_REPOSITORY_ROLE_RELATOR_CODES_UNPUBLISHED_MATERIAL_EAD_FILE_PATH =
    path.join( __dirname, '../fixtures/mc_100-invalid-eadid-repository-role-relator-codes-unpublished-material.xml ' );
const MC_100_MISSING_EADID_AND_REPOSITORY_CORPNAME_EAD_FILE_PATH =
    path.join( __dirname, '../fixtures/mc_100-missing-eadid-and-repository-corpname.xml' );

const EADID_CONFLICT_RESULTS_TEXT =
    `Uploading EAD file mc_100-eadid-conflict.xml...
Upload complete.
Validating EAD file...
------------------------------------------------------------------------------
Error: <eadid> conflict with a published finding aid in a different repository

A published finding aid with <eadid> "tam_100" already exists in repository "Tamiment Library and Robert F. Wagner Labor Archives":

EAD ID: tam_100
REPOSITORY: Tamiment Library and Robert F. Wagner Labor Archives
TIMESTAMP: 1530045309

The uploaded EAD file belongs to repository "New York University Archives".  <eadid> values must be unique across all repositories.
In order to create an in-process finding aid from this EAD file, you must either delete the existing published finding aid in repository "Tamiment Library and Robert F. Wagner Labor Archives", or change the <eadid> value in this EAD file.

-----------------------------------------------------------------

Please make the necessary corrections and re-upload the EAD file.`;

const INVALID_EADID_REPOSITORY_ROLE_RELATOR_CODES_UNPUBLISHED_MATERIAL_RESULTS_TEXT =
    `Uploading EAD file mc_100-invalid-eadid-repository-role-relator-codes-unpublished-material.xml...
Upload complete.
Validating EAD file...
---------------------------
Error: Invalid <repository>

<repository> contains unknown repository name "NYU Archives".
The repository name must match a value from this list:

Akkasah: Center for Photography (NYU Abu Dhabi)
New York University Archives
Center for Brooklyn History
Fales Library and Special Collections
Villa La Pietra
New-York Historical Society
NYU Abu Dhabi, Archives and Special Collections
Poly Archives at Bern Dibner Library of Science and Technology
Tamiment Library and Robert F. Wagner Labor Archives

----------------------
Error: Invalid <eadid>

<eadid> value "mc.100" does not conform to the Finding Aids specification.
There must be between 2 to 8 character groups joined by underscores.
The following characters are not allowed in character groups: .

----------------------------
Error: Private data detected

The EAD file contains unpublished material.  The following EAD elements have attribute audience="internal" and must be removed:

<bioghist>
<processinfo>

---------------------------------
Error: Unrecognized relator codes

The EAD file contains elements with role attributes containing unrecognized relator codes:

<controlaccess><corpname>Columbia University</corpname></controlaccess> has role="orz"
<controlaccess><corpname>The New School</corpname></controlaccess> has role="cpr"
<controlaccess><famname>Buell Family</famname></controlaccess> has role="cpo"
<controlaccess><famname>Lanier Family</famname></controlaccess> has role="fdr"
<controlaccess><persname>John Doe, 1800-1900</persname></controlaccess> has role="clb"
<controlaccess><persname>Jane Doe, 1800-1900</persname></controlaccess> has role="grt"
<origination><corpname>Queens College</corpname></origination> has role="cpr"
<origination><corpname>Hunter College</corpname></origination> has role="orz"
<origination><famname>Draper family</famname></origination> has role="fro"
<origination><persname>Daisy, Bert</persname></origination> has role="clb"
<origination><persname>Orchid, Ella</persname></origination> has role="grt"
<repository><corpname>NYU Archives</corpname></repository> has role="grt"

-----------------------------------------------------------------

Please make the necessary corrections and re-upload the EAD file.`;

const INVALID_XML_FILE_ERROR_RESULTS_TEXT =
    `Uploading EAD file invalid-xml.xml...
Upload complete.
Validating EAD file...
----------------------------------------------------------------------------------
Error: The XML in this file is not valid.  Please check it using an XML validator.

`;

const MISSING_ELEMENTS_ERRORS_RESULTS_TEXT =
    `Uploading EAD file mc_100-missing-eadid-and-repository-corpname.xml...
Upload complete.
Validating EAD file...

ERROR: Required element <eadid> not found.

ERROR: Required element <repository>/<corpname> not found.
`;

// This const initialization must be done before initialization of
// SUCCESSFUL_CREATION_OF_IN_PROCESS_FINDING_AID_RESULTS_TEXT
const SUCCESSFUL_UPLOAD_OF_VALID_EAD_FILE_RESULTS_TEXT =
    `Uploading EAD file mc_100.xml...
Upload complete.
Validating EAD file...
File validation is complete.

Click Submit to move this file to In-Process FAs and to create a preview finding aid for:

EAD ID: mc_100
REPOSITORY: New York University Archives

`;

// This const initialization must be done before initialization of
// SUCCESSFUL_CREATION_OF_IN_PROCESS_FINDING_AID_RESULTS_TEXT
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

    test( 'Submit button is disabled on first load', function () {
        assert.isFalse( CreateNewFindingAid.submitButton.isEnabled() );
    } );

    test( 'Invalid XML files are rejected with the correct error message', function () {
        CreateNewFindingAid.uploadFile( INVALID_XML_FILE_PATH );

        waitUntil(
            () => CreateNewFindingAid.results.includes( 'Error' ),
            'Results text does not include the string "Error"',
            {
                timeout    : 10000,
            },
        );

        assert.equal( CreateNewFindingAid.results, INVALID_XML_FILE_ERROR_RESULTS_TEXT );
    } );

    test( 'An invalid Finding Aids EAD file is rejected with the correct error messages', function () {
        CreateNewFindingAid.uploadFile( INVALID_XML_FILE_PATH );

        waitUntil(
            () => CreateNewFindingAid.results.includes( 'Error' ),
            'Results text does not include the string "Error"',
            {
                timeout    : 10000,
            },
        );

        assert.equal( CreateNewFindingAid.results, INVALID_XML_FILE_ERROR_RESULTS_TEXT );
        assert.isFalse( CreateNewFindingAid.submitButton.isEnabled() );
    } );

    test( 'An EAD file missing required elements is rejected with the correct error messages', function () {
        CreateNewFindingAid.uploadFile( MC_100_MISSING_EADID_AND_REPOSITORY_CORPNAME_EAD_FILE_PATH );

        waitUntil(
            () => CreateNewFindingAid.results.includes( 'ERROR' ),
            'Results text does not include the string "ERROR"',
            {
                timeout    : 10000,
            },
        );

        assert.equal( CreateNewFindingAid.results, MISSING_ELEMENTS_ERRORS_RESULTS_TEXT );
        assert.isFalse( CreateNewFindingAid.submitButton.isEnabled() );
    } );

    test( 'An EAD file with invalid elements and unpublished material is rejected with the correct error messages', function () {
        CreateNewFindingAid.uploadFile( MC_100_INVALID_EADID_REPOSITORY_ROLE_RELATOR_CODES_UNPUBLISHED_MATERIAL_EAD_FILE_PATH );

        waitUntil(
            () => CreateNewFindingAid.results.includes( 'Error' ),
            'Results text does not include the string "Error"',
            {
                timeout    : 10000,
            },
        );

        assert.equal( CreateNewFindingAid.results, INVALID_EADID_REPOSITORY_ROLE_RELATOR_CODES_UNPUBLISHED_MATERIAL_RESULTS_TEXT );
        assert.isFalse( CreateNewFindingAid.submitButton.isEnabled() );
    } );

    test( 'An EAD file with an <eadid> value duplicating the <eadid> value of another EAD file in a different repository is rejected with the correct error messages', function () {
        CreateNewFindingAid.uploadFile( MC_100_EADID_CONFLICT_EAD_FILE_PATH );

        waitUntil(
            () => CreateNewFindingAid.results.includes( 'Error' ),
            'Results text does not include the string "Error"',
            {
                timeout    : 10000,
            },
        );

        assert.equal( CreateNewFindingAid.results, EADID_CONFLICT_RESULTS_TEXT );
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

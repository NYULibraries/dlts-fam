/* global browser:false */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import stringify from 'json-stable-stringify';
import { sync as commandExistsSync } from 'command-exists';

const ACTUAL_FILES_ROOT = path.resolve( __dirname, '../tests/testdata/actual/' );
const DIFF_FILES_ROOT = path.resolve( __dirname, '../tests/testdata/diffs/' );
const GOLDEN_FILES_ROOT = path.resolve( __dirname, '../tests/testdata/golden/' );

const DIFF = 'diff';
const DIFF_EXISTS = commandExistsSync( DIFF );

function clearActualFilesDirectory( suiteNameArg ) {
    if ( Object.values( SUITE_NAME ).includes( suiteNameArg ) ) {
        const actualFilesDirectory = getActualFilesDirectory( suiteNameArg );

        try {
            rimraf.sync( path.resolve( actualFilesDirectory, './*' ) );
        } catch( error ) {
            console.error( `ERROR clearing actual files directory: ${ error }` );

            process.exit( 1 );
        }
    } else {
        throw new Error( `Invalid suiteArg "${ suiteNameArg }` );
    }
}

function clearDiffFilesDirectory( suiteNameArg ) {
    if ( Object.values( SUITE_NAME ).includes( suiteNameArg ) ) {
        const diffFilesDirectory = getDiffFilesDirectory( suiteNameArg );

        try {
            rimraf.sync( path.resolve( diffFilesDirectory, './*' ) );
        } catch( error ) {
            console.error( `ERROR clearing diff files directory: ${ error }` );

            process.exit( 1 );
        }
    } else {
        throw new Error( `Invalid suiteArg "${ suiteNameArg }` );
    }
}

function diffActualVsGoldenAndReturnMessage( suiteName, actualFile, goldenFile, id ) {
    let message = 'Actual filter results do not match expected.';

    if ( DIFF_EXISTS ) {
        // Create the diff file for later inspection
        const diffFile = getDiffFilePath( suiteName, id );
        const command = `diff ${ goldenFile } ${ actualFile } > ${ diffFile }`;

        // Note that this will always throw an exception because `diff`
        // throws when files are different.
        try {
            execSync( command );
        } catch( e ) {
            if ( ! e.stderr.toString() ) {
                // This is what is expected -- diff command succeeds.
                message += `  See diff file: ${ diffFile }`;
            } else {
                // This is unexpected -- diff command failed to create
                // the diff file.
                message += `  Diff command \`${ command }\` failed:

${ e.stderr.toString() }`;
            }
        }
    } else {
        message += `  \`${ DIFF }\` command not available.  Compare actual file vs golden file for details:
${ goldenFile }
${ actualFile }`;
    }

    return message;
}

function getActualFilePath( suiteName, id ) {
    return path.resolve( getActualFilesDirectory( suiteName ), `./${ id }.json` );
}

function getActualFilesDirectory( suiteNameArg ) {
    return path.resolve(
        ACTUAL_FILES_ROOT,
        `${ suiteNameArg }/`,
        getBrowserName(),
    );
}

function getBrowserName() {
    return browser.options.capabilities.browserName;
}

function getCurrentUrl() {
    return browser.getUrl();
}

function getDiffFilePath( suiteName, id ) {
    return path.resolve( getDiffFilesDirectory( suiteName ), `./${ id }.txt` );
}

function getDiffFilesDirectory( suiteNameArg ) {
    return path.resolve(
        DIFF_FILES_ROOT,
        `${ suiteNameArg }/`,
        getBrowserName(),
    );
}

function getGoldenFilePath( suiteName, id ) {
    return path.resolve( getGoldenFilesDirectory( suiteName ), `./${ id }.json` );
}

function getGoldenFiles( suiteName ) {
    const goldenFilesDirectory = getGoldenFilesDirectory( suiteName );
    const goldenFiles = fs.readdirSync( goldenFilesDirectory )
        .map( ( file ) => {
            return path.resolve( goldenFilesDirectory, `./${ file }` );
        } );

    return goldenFiles;
}

function getGoldenFilesDirectory( suiteNameArg ) {
    return path.resolve( GOLDEN_FILES_ROOT, `${ suiteNameArg }/` );
}

function isDisabled( element ) {
    return element.getAttribute( 'disabled' ) === 'disabled' ||
           element.getAttribute( 'disabled' ) === 'true';
}

function jsonStableStringify( data ) {
    return stringify(
        data,
        { space : '    ' },
    );
}

function updateGoldenFiles() {
    return process.env.UPDATE_GOLDEN_FILES &&
           process.env.UPDATE_GOLDEN_FILES.toLowerCase() !== 'false';
}

function waitUntil( fn, timeoutMessage, optionsArg ) {
    const timeout = ( optionsArg && optionsArg.timeout ) || 5000;

    const options = {
        timeout    : timeout,
        timeoutMsg : timeoutMessage || `waitUntil() condition not met after ${ timeout / 1000 } seconds`,
    };

    browser.waitUntil( fn, options );
}

export const SUITE_NAME = {
    create                     : 'create',
    home                       : 'home',
    login                      : 'login',
    manageInProcessFindingAids : 'manage-in-process-finding-aids',
    managePublishedFindingAids : 'manage-published-finding-aids',
    navbar                     : 'navbar',
};

export {
    clearActualFilesDirectory,
    clearDiffFilesDirectory,
    diffActualVsGoldenAndReturnMessage,
    getActualFilePath,
    getActualFilesDirectory,
    getCurrentUrl,
    getDiffFilesDirectory,
    getGoldenFilePath,
    getGoldenFiles,
    getGoldenFilesDirectory,
    isDisabled,
    jsonStableStringify,
    updateGoldenFiles,
    waitUntil,
};

<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Upload EAD XML file
            </h1>

            <b-row
                id="upload-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="upload-col"
                    cols="6"
                >
                    <!-- Styled -->
                    <b-form-file
                        ref="upload-file-input"
                        v-model="file"
                        :state="formFileState"
                        accept=".xml"
                        placeholder="Choose an EAD file or drop it here..."
                        drop-placeholder="Drop file here..."
                    />
                </b-col>
            </b-row>

            <b-row
                id="results-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="results-col"
                >
                    <b-form-textarea
                        id="results-textarea"
                        v-model="results"
                        placeholder="Waiting for upload of EAD file..."
                        rows="15"
                        readonly
                        plaintext
                    />
                </b-col>
            </b-row>

            <b-row
                id="buttons-row"
                class="row"
                align-h="center"
            >
                <b-col
                    id="buttons-col"
                    cols="10"
                >
                    <b-button
                        id="cancel-button"
                        class="button"
                        variant="dark"
                        :disabled="cancelDisabled"
                        @click="cancel"
                    >
                        Cancel
                    </b-button>
                    <b-button
                        id="submit-button"
                        class="button"
                        variant="success"
                        :disabled="submitDisabled"
                        @click="submit"
                    >
                        Submit
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

import Navbar from './Navbar';

const validRelatorCodes = [
    'abr',
    'acp',
    'act',
    'adi',
    'adp',
    'aft',
    'anl',
    'anm',
    'ann',
    'ant',
    'ape',
    'apl',
    'app',
    'aqt',
    'arc',
    'ard',
    'arr',
    'art',
    'asg',
    'asn',
    'ato',
    'att',
    'auc',
    'aud',
    'aui',
    'aus',
    'aut',
    'bdd',
    'bjd',
    'bkd',
    'bkp',
    'blw',
    'bnd',
    'bpd',
    'brd',
    'brl',
    'bsl',
    'cas',
    'ccp',
    'chr',
    'cli',
    'cll',
    'clr',
    'clt',
    'cmm',
    'cmp',
    'cmt',
    'cnd',
    'cng',
    'cns',
    'coe',
    'col',
    'com',
    'con',
    'cor',
    'cos',
    'cot',
    'cou',
    'cov',
    'cpc',
    'cpe',
    'cph',
    'cpl',
    'cpt',
    'cre',
    'crp',
    'crr',
    'crt',
    'csl',
    'csp',
    'cst',
    'ctb',
    'cte',
    'ctg',
    'ctr',
    'cts',
    'ctt',
    'cur',
    'cwt',
    'dbp',
    'dfd',
    'dfe',
    'dft',
    'dgg',
    'dgs',
    'dis',
    'dln',
    'dnc',
    'dnr',
    'dpc',
    'dpt',
    'drm',
    'drt',
    'dsr',
    'dst',
    'dtc',
    'dte',
    'dtm',
    'dto',
    'dub',
    'edc',
    'edm',
    'edt',
    'egr',
    'elg',
    'elt',
    'eng',
    'enj',
    'etr',
    'evp',
    'exp',
    'fac',
    'fds',
    'fld',
    'flm',
    'fmd',
    'fmk',
    'fmo',
    'fmp',
    'fnd',
    'fpy',
    'frg',
    'gis',
    'his',
    'hnr',
    'hst',
    'ill',
    'ilu',
    'ins',
    'inv',
    'isb',
    'itr',
    'ive',
    'ivr',
    'jud',
    'jug',
    'lbr',
    'lbt',
    'ldr',
    'led',
    'lee',
    'lel',
    'len',
    'let',
    'lgd',
    'lie',
    'lil',
    'lit',
    'lsa',
    'lse',
    'lso',
    'ltg',
    'lyr',
    'mcp',
    'mdc',
    'med',
    'mfp',
    'mfr',
    'mod',
    'mon',
    'mrb',
    'mrk',
    'msd',
    'mte',
    'mtk',
    'mus',
    'nrt',
    'opn',
    'org',
    'orm',
    'osp',
    'oth',
    'own',
    'pan',
    'pat',
    'pbd',
    'pbl',
    'pdr',
    'pfr',
    'pht',
    'plt',
    'pma',
    'pmn',
    'pop',
    'ppm',
    'ppt',
    'pra',
    'prc',
    'prd',
    'pre',
    'prf',
    'prg',
    'prm',
    'prn',
    'pro',
    'prp',
    'prs',
    'prt',
    'prv',
    'pta',
    'pte',
    'ptf',
    'pth',
    'ptt',
    'pup',
    'rbr',
    'rcd',
    'rce',
    'rcp',
    'rdd',
    'red',
    'ren',
    'res',
    'rev',
    'rpc',
    'rps',
    'rpt',
    'rpy',
    'rse',
    'rsg',
    'rsp',
    'rsr',
    'rst',
    'rth',
    'rtm',
    'sad',
    'sce',
    'scl',
    'scr',
    'sds',
    'sec',
    'sgd',
    'sgn',
    'sht',
    'sll',
    'sng',
    'spk',
    'spn',
    'spy',
    'srv',
    'std',
    'stg',
    'stl',
    'stm',
    'stn',
    'str',
    'tcd',
    'tch',
    'ths',
    'tld',
    'tlp',
    'trc',
    'trl',
    'tyd',
    'tyg',
    'uvp',
    'vac',
    'vdg',
    'wac',
    'wal',
    'wam',
    'wat',
    'wdc',
    'wde',
    'win',
    'wit',
    'wpr',
    'wst',
];

// This will fill this.uploadedFindingAid
const requiredEADElementsGetters = {
    eadid : function ( eadDoc ) {
        const elementName = '<eadid>';
        const element = eadDoc.getElementsByTagName( 'eadid' )[ 0 ];

        let elementValue;
        if ( element ) {
            elementValue = element.textContent.trim();

            if ( ! elementValue ) {
                throw new Error( `ERROR: Required element ${ elementName } is empty.` );
            }

            return elementValue;
        } else {
            throw new Error( `ERROR: Required element ${ elementName } not found.` );
        }
    },
    repository : function ( eadDoc ) {
        const elementName = '<repository>/<corpname>';
        let element;
        let elementValue;
        try {
            element = eadDoc.getElementsByTagName( 'repository' )[ 0 ]
                .getElementsByTagName( 'corpname' )[ 0 ];

            elementValue = element.textContent.trim();
        } catch( e ) {
            throw new Error( `ERROR: Required element ${ elementName } not found.` );
        }

        if ( ! elementValue ) {
            throw new Error( `ERROR: Required element ${ elementName } is empty.` );
        }

        return elementValue;
    },
};

let parser;

export default {
    name       : 'CreateNewFindingAid',
    components : {
        Navbar,
    },
    data() {
        return {
            file                : null,
            cancelDisabled      : null,
            inProcessFindingAid : null,
            results             : null,
            formFileState       : null,
            submitDisabled      : true,
            uploadedFindingAid  : {},
        };
    },
    computed : {
        recognizedRepositoryNames() {
            return Object.keys( this.repositories ).map( repositoryCode => {
                return this.repositories[ repositoryCode ].name;
            } );
        },
        recognizedRepositoryNamesListHTML() {
            return this.recognizedRepositoryNames.map( repositoryName => {
                return `<li>${ repositoryName.replace( '&', '&amp;amp;' ) }</li>\n`;
            } ).join( '' );
        },
        ...mapGetters(
            [
                'currentUser',
                'currentRepositoryNames',
                'inProcessFindingAids',
                'publishedFindingAids',
                'repositories',
            ],
        ),
    },
    watch : {
        async file() {
            if ( this.file ) {
                this.cancelDisabled = true;

                if ( ! this.file.name.endsWith( '.xml' ) ) {
                    this.results = 'The uploaded EAD file must have a .xml extension.';
                    this.formFileState = false;
                    return;
                }

                this.formFileState = true;
                this.results = `Uploading EAD file ${ this.file.name }...\n`;
                await this.$sleep( 5000 );
                this.results += 'Upload complete.\n';

                const ead = await this.$readFileAsTextSync( this.file );

                this.processEAD( ead );

                // Need to do this so that users can re-upload same file in Chrome
                this.$refs[ 'upload-file-input' ].reset();

                this.cancelDisabled = false;
            }
        },
    },
    mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );

            return;
        }

        parser = new DOMParser();

        this.setHelpModal(
            {
                content : `
This interactive mockup does basic validation of the EAD file.
If any of the elements listed below are missing, or are present but empty,
the EAD file will not be accepted.

<br>
<br>

<ul>
    <li>eadid:<br />
        <code>
            &lt;ead&gt;[EADID]&lt;/eadid&gt;
        </code>
    </li>
    <li>repository:<br />
        <code>
            &lt;repository&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;corpname&gt;[REPOSITORY LONG NAME]&lt;/corpname&gt;<br />
            &lt;/repository&gt;
        </code>
    </li>
</ul>

<br>
<br>

Some things to try:

<br>
<br>

<ul>
    <li>Upload a file with valid content using a filename ending in .xml</li>
    <li>Upload a file with valid content using a filename that does not end in .xml</li>
    <li>Upload a file with that is missing one or more of the required elements listed above
    </li>
    <li>Upload a file with one or more elements with empty values in one or more of the required elements listed above</li>
    <li>

        Upload a file with an &lt;eadid&gt; that does not conform to the
        <a
            href="https://jira.nyu.edu/jira/browse/FADESIGN-20?focusedCommentId=426301&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-426301"
            target="_blank">
            rules
        </a>
    </li>
    <li>
        Upload a file with a &lt;repository&gt/&lt;corpname&gt; value that is not a recognized.
        These are the currently recognized repository long names:
        <ul>
            ${ this.recognizedRepositoryNamesListHTML }
        </ul>
    </li>
    <li>
        Upload a file with multiple elements that have <code>role</code> attributes
        containing unrecognized relator codes - i.e. codes not in the
        <a
            href="https://github.com/nyudlts/fadesign_29-data-model/blob/master/relator-authoritative-labels.csv"
            target="_blank">
            official Finding Aids relator codes list
        </a>.
        Elements whose <code>role</code> attributes are checked for valid relator codes:
        <ul>
            <li><code>&lt;controlaccess&gt;&lt;corpname role="[RELATOR CODE]"&gt;...&lt;/corpname&gt;&lt;/controlaccess&gt;</li></code>
            <li><code>&lt;controlaccess&gt;&lt;famname role="[RELATOR CODE]"&gt;...&lt;/famname&gt;&lt;/controlaccess&gt;</li></code>
            <li><code>&lt;controlaccess&gt;&lt;persname role="[RELATOR CODE]"&gt;...&lt;/persname&gt;&lt;/controlaccess&gt;</li></code>
            <li><code>&lt;origination&gt;&lt;corpname role="[RELATOR CODE]"&gt;...&lt;/corpname&gt;&lt;/origination&gt;</li></code>
            <li><code>&lt;origination&gt;&lt;famname role="[RELATOR CODE]"&gt;...&lt;/famname&gt;&lt;/origination&gt;</li></code>
            <li><code>&lt;origination&gt;&lt;persname role="[RELATOR CODE]"&gt;...&lt;/persname&gt;&lt;/origination&gt;</li></code>
            <li><code>&lt;repository&gt;&lt;corpname role="[RELATOR CODE]"&gt;...&lt;/corpname&gt;&lt;/repository&gt;</li></code>
        </ul>
    </li>
    <li>Click the Cancel button after an upload has completed, but before submitting using the Submit button</li>
    <li>
        Upload a valid EAD file containing one or more elements with attribute <code>audience="internal"</code>.
        <br />
        Example:
        <br />
        <code>
&lt;ead...&gt;<br/ >
<br/ >
...<br />
<br/ >
&nbsp;&nbsp;&lt;did&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&lt;repository&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;corpname&gt;New York University Archives&lt;/corpname&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/repository&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&lt;unittitle&gt;John "The Cop" Quigley Collection&lt;/unittitle&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&lt;origination <strong>audience="internal"</strong> label="Creator"&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;persname source="local"&gt;Oscar Rose, Secretary of the Committee on Publication; member of the NYU Arts and Engineering Alumni Association&lt;/persname&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/origination&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&lt;unitid&gt;MC.100&lt;/unitid&gt;<br/ >
&nbsp;&nbsp;&nbsp;&nbsp;&lt;unitid <strong>audience="internal"</strong> identifier="248" type="Archivists Toolkit Database::RESOURCE"&gt;248&lt;/unitid&gt;<br/ >
<br/ >
...<br/ >
<br/ >
&lt;ead&gt;<br />
        </code>

    </li>
    <li>Upload an EAD file with the same &lt;eadid&gt; value as:
        <ul>
            <li>an existing <strong>in-process</strong> finding aid which belongs to the <strong>same repository</strong></li>
            <li>an existing <strong>in-process</strong> finding aid which belongs to a <strong>different repository</strong></li>
            <li>an existing <strong>published</strong> finding aid which belongs to a <strong>different repository</strong></li>
        </ul>
    </li>
    <li>Upload a valid EAD file and submit it using the Submit button</li>
</ul>
`,
                title   : 'Create New Finding Aid screen',
            },
        );
    },
    methods : {
        cancel() {
            this.file = null;
            this.results = null;
            this.formFileState = true;
            this.submitDisabled = true;
        },
        getErrorHeader( headerText ) {
            const label = 'Error: ';
            const dashes = '-'.repeat( headerText.length + label.length );

            return `${ dashes }\n${ label }${ headerText }\n\n`;
        },
        getFindingAidDescription( findingAid ) {
            let description =
                `EAD ID: ${ findingAid.eadid }\n` +
                `REPOSITORY: ${ findingAid.repository }\n`;

            if ( findingAid.timestamp ) {
                description += `TIMESTAMP: ${ findingAid.timestamp }\n`;
            }

            return description;
        },
        getRepositoryCodeForRepository( repositoryName ) {
            var that = this,
                repositoryCode;

            Object.keys( this.repositories ).forEach( code => {
                if ( that.repositories[ code ].name === repositoryName ) {
                    repositoryCode = code;
                }
            } );

            return repositoryCode;
        },
        getRequiredEADElements( eadDoc, requiredEADElements ) {
            let result = true;

            for ( const [ elementName, getter ] of Object.entries( requiredEADElements ) ) {
                try {
                    this.uploadedFindingAid[ elementName ] = getter( eadDoc );
                } catch( e ) {
                    result = false;

                    this.results += `\n${ e.message }\n`;
                }
            }

            return result;
        },
        async processEAD( ead ) {
            this.results += 'Validating EAD file...\n';

            await this.$sleep( 2000 );

            let abort = false;
            this.uploadedFindingAid = {};

            const eadDoc = parser.parseFromString( ead, 'application/xml' );

            // These validate methods will update this.results accordingly.
            if ( ! this.validateXML( eadDoc ) ) {
                return;
            }

            if ( ! this.getRequiredEADElements( eadDoc, requiredEADElementsGetters ) ) {
                abort = true;
            }

            if ( ! this.validateRepository() ) {
                abort = true;
            }
            this.uploadedFindingAid.repositoryCode =
                this.getRepositoryCodeForRepository( this.uploadedFindingAid.repository );

            if ( ! this.validateEADID( this.uploadedFindingAid.eadid ) ) {
                abort = true;
            }

            if ( ! this.validateEADIDNoConflicts() ) {
                abort = true;
            }

            if ( ! this.validateNoUnpublishedMaterial( eadDoc ) ) {
                abort = true;
            }

            if ( ! this.validateRoleAttributes( eadDoc ) ) {
                abort = true;
            }

            if ( abort ) {
                const instruction = 'Please make the necessary corrections and re-upload the EAD file.';
                this.results += '-'.repeat( instruction.length ) + '\n\n' + instruction;

                this.formFileState = false;
                this.submitDisabled = true;

                return;
            }

            this.newInProcessFindingAid = {
                timestamp   : Math.round( ( new Date() ).getTime() / 1000 ),
                id         : this.uploadedFindingAid.eadid,
                repository : this.uploadedFindingAid.repositoryCode,
                title      : this.uploadedFindingAid.title,
            };

            this.results += `File validation is complete.

Click Submit to move this file to In-Process FAs and to create a preview finding aid for:

`;

            this.results += this.getFindingAidDescription( this.uploadedFindingAid ) + '\n';

            this.submitDisabled = false;
        },
        async submit() {
            this.results += 'Creating in-process finding aid...\n';

            await this.$sleep( 5000 );

            this.addInProcessFindingAid( this.newInProcessFindingAid );

            const formattedTimestamp =
                moment( this.newInProcessFindingAid.timestamp * 1000 ).format( 'M/D/YYYY h:mm a' );

            this.results += `New in-process finding aid created with timestamp ${  formattedTimestamp }.

Proceed to In-process FAs to preview the new EAD file and finding aid.

`;

            this.submitDisabled = true;
        },
        validateEADID( eadid ) {
            const errors = [];

            const tokens = eadid.split( '_' );
            if ( tokens.length < 2 || tokens.length > 8 ) {
                errors.push( 'There must be between 2 to 8 character groups joined by underscores.' );
            }

            const allowedCharactersRegex = /[^a-z0-9]/g;
            const disallowedCharactersFoundObject = {};
            tokens.forEach( token => {
                const matches = [ ...token.matchAll( allowedCharactersRegex ) ];

                if ( matches.length > 0 ) {
                    matches.forEach( match => {
                        disallowedCharactersFoundObject[ match ] = true;
                    } );
                }
            } );

            const disallowedCharactersFound = Object.keys( disallowedCharactersFoundObject );
            if ( disallowedCharactersFound.length > 0 ) {
                errors.push( 'The following characters are not allowed in character groups: ' +
                             disallowedCharactersFound.sort().join( ', ' ) );
            }

            if ( errors.length > 0 ) {
                this.results += this.getErrorHeader( 'Invalid <eadid>' ) +
                                `<eadid> value "${ eadid }" does ` +
                                'not conform to the Finding Aids specification.\n';

                this.results += errors.join( '\n' ) + '\n\n';

                return false;
            }

            return true;
        },
        validateEADIDNoConflicts() {
            const noConflictsInInProcess =
                this.validateEADIDNoConflictsInInProcess();

            const noConflictsInInProcessPublished =
                this.validateEADIDNoConflictsInPublished();

            // We can't return
            //    this.validateEADIDNoConflictsInInProcess() &&
            //    this.validateEADIDNoConflictsInInProcess()
            // ...because both methods must run for side effects, and && will
            // short-circuit the latter method call if the first returns false.
            return noConflictsInInProcess && noConflictsInInProcessPublished;
        },
        validateEADIDNoConflictsInInProcess() {
            const eadid = this.uploadedFindingAid.eadid;
            const repository = this.uploadedFindingAid.repository;

            let existingInProcessFindingAidWithSameEADID;
            Object.keys( this.inProcessFindingAids ).forEach( repositoryCode => {
                if ( this.inProcessFindingAids[ repositoryCode ][ eadid ] ) {
                    existingInProcessFindingAidWithSameEADID =
                        this.inProcessFindingAids[ repositoryCode ][ eadid ];
                    existingInProcessFindingAidWithSameEADID.eadid = eadid;
                    existingInProcessFindingAidWithSameEADID.repository = this.repositories[ repositoryCode ].name;
                    existingInProcessFindingAidWithSameEADID.repositoryCode = repositoryCode;
                }
            } );

            if ( existingInProcessFindingAidWithSameEADID ) {
                if ( existingInProcessFindingAidWithSameEADID.repository === repository ) {
                    this.results += this.getErrorHeader( 'Finding aid already in-process' ) +
`An in-process finding aid with <eadid> "${ eadid }" already exists:

${ this.getFindingAidDescription( existingInProcessFindingAidWithSameEADID ) }
You must delete or publish this in-process finding aid before uploading this EAD file.

`;
                } else {
                    this.results += this.getErrorHeader( '<eadid> conflict with an in-process finding aid in a different repository' ) +
`An in-process finding aid with <eadid> "${ eadid }" already exists in repository "${ existingInProcessFindingAidWithSameEADID.repository }":

${ this.getFindingAidDescription( existingInProcessFindingAidWithSameEADID ) }

The uploaded EAD file belongs to repository "${ repository }".  <eadid> values must be unique across all repositories.
In order to create an in-process finding aid from this EAD file, `;

                    let fixMethod = 'delete/publish';
                    if ( ! this.currentRepositoryNames.includes( existingInProcessFindingAidWithSameEADID.repository ) ) {
                        fixMethod = 'request the deletion/publication of';
                    }

                    this.results +=
`you must either ${ fixMethod } the existing in-process finding aid in repository "${ existingInProcessFindingAidWithSameEADID.repository }" ` +
`or change the <eadid> value in this EAD file.

`;
                }

                return false;
            }

            return true;
        },
        validateEADIDNoConflictsInPublished() {
            const eadid = this.uploadedFindingAid.eadid;
            const repository = this.uploadedFindingAid.repository;

            let existingPublishedFindingAidWithSameEADIDInDifferentRepository;
            Object.keys( this.publishedFindingAids ).forEach( repositoryCode => {
                if ( this.publishedFindingAids[ repositoryCode ][ eadid ] &&
                     repositoryCode !== this.uploadedFindingAid.repositoryCode ) {
                    existingPublishedFindingAidWithSameEADIDInDifferentRepository =
                        this.publishedFindingAids[ repositoryCode ][ eadid ];
                    existingPublishedFindingAidWithSameEADIDInDifferentRepository.eadid = eadid;
                    existingPublishedFindingAidWithSameEADIDInDifferentRepository.repository = this.repositories[ repositoryCode ].name;
                    existingPublishedFindingAidWithSameEADIDInDifferentRepository.repositoryCode = repositoryCode;
                }
            } );

            if ( existingPublishedFindingAidWithSameEADIDInDifferentRepository ) {
                this.results += this.getErrorHeader( '<eadid> conflict with a published finding aid in a different repository' ) +
`A published finding aid with <eadid> "${ eadid }" already exists in repository "${ existingPublishedFindingAidWithSameEADIDInDifferentRepository.repository }":

${ this.getFindingAidDescription( existingPublishedFindingAidWithSameEADIDInDifferentRepository ) }
The uploaded EAD file belongs to repository "${ repository }".  <eadid> values must be unique across all repositories.
In order to create an in-process finding aid from this EAD file, `;

                let deletionMethod = 'delete';
                if ( ! this.currentRepositoryNames.includes( existingPublishedFindingAidWithSameEADIDInDifferentRepository.repository ) ) {
                    deletionMethod = 'request the deletion of';
                }

                this.results +=
`you must either ${ deletionMethod } the existing published finding aid in repository "${ existingPublishedFindingAidWithSameEADIDInDifferentRepository.repository }", ` +
`or change the <eadid> value in this EAD file.

`;

                return false;
            }

            return true;
        },
        validateNoUnpublishedMaterial( eadDoc ) {
            const allElements = eadDoc.getElementsByTagName( '*' );
            const elementsWithAudienceInternal = [];

            allElements.forEach( element => {
                if ( element.getAttribute( 'audience' ) === 'internal' ) {
                    elementsWithAudienceInternal.push( element );
                }
            } );

            if ( elementsWithAudienceInternal.length > 0 ) {
                this.results += this.getErrorHeader( 'Private data detected' ) +
                                'The EAD file contains unpublished material.  ' +
                                'The following EAD elements have attribute audience="internal" and must be removed:\n\n';

                elementsWithAudienceInternal.forEach( element => {
                    this.results += `<${ element.tagName }>\n`;
                } );

                this.results += '\n';

                return false;
            }

            return true;
        },
        validateRepository() {
            if ( this.uploadedFindingAid.repository ) {
                if ( this.recognizedRepositoryNames.includes( this.uploadedFindingAid.repository ) ) {
                    if ( ! this.currentRepositoryNames.includes( this.uploadedFindingAid.repository ) ) {
                        this.results += this.getErrorHeader(
                            `User ${ this.currentUser } is not currently authorized` +
                            ` to create a finding aid for repository "${ this.uploadedFindingAid.repository }".` );

                        return false;
                    }
                } else {
                    this.results += this.getErrorHeader( 'Invalid <repository>' ) +
`<repository> contains unknown repository name "${ this.uploadedFindingAid.repository }".
The repository name must match a value from this list:

${ this.recognizedRepositoryNames.join( '\n' ) }

`;

                    return false;
                }
            }

            return true;
        },
        validateRoleAttributes( eadDoc ) {
            const tagListsForElementsToValidate = [
                [ 'controlaccess', 'corpname' ],
                [ 'controlaccess', 'famname'  ],
                [ 'controlaccess', 'persname' ],
                [ 'origination',   'corpname' ],
                [ 'origination',   'famname' ],
                [ 'origination',   'persname' ],
                [ 'repository',    'corpname' ],
            ];

            const elementsWithInvalidRoleAttributeErrors = [];

            tagListsForElementsToValidate.forEach( tagListForElementToValidate => {
                const selector = tagListForElementToValidate.join( ' ' ) + '[ role ]';
                const elements = eadDoc.querySelectorAll( selector );

                elements.forEach( element => {
                    const roleAttribute = ( element.getAttribute( 'role' ) );

                    if ( ! validRelatorCodes.includes( roleAttribute ) ) {
                        elementsWithInvalidRoleAttributeErrors.push( {
                            tagList       : tagListForElementToValidate,
                            elementText   : element.textContent,
                            roleAttribute : roleAttribute,
                        } );
                    }
                } );
            } );

            if ( elementsWithInvalidRoleAttributeErrors.length > 0 ) {
                this.results += this.getErrorHeader( 'Unrecognized relator codes' ) +
                                'The EAD file contains elements with role attributes containing unrecognized relator codes' +
                                ':\n\n';

                elementsWithInvalidRoleAttributeErrors.forEach( elementWithInvalidRoleAttributeError => {
                    const tagList = elementWithInvalidRoleAttributeError.tagList.slice();

                    function wrap( inner, tagList ) {
                        if ( tagList.length === 0 ) {
                            return inner;
                        }

                        const nextTag = tagList.pop();
                        return wrap( `<${ nextTag }>${ inner }</${ nextTag }>`, tagList );
                    }

                    const element = wrap(
                        elementWithInvalidRoleAttributeError.elementText,
                        tagList,
                    );

                    this.results +=
                        `${ element } has role="${ elementWithInvalidRoleAttributeError.roleAttribute }"\n`;
                } );

                this.results += '\n';

                return false;
            }

            return true;
        },
        validateXML( eadDoc ) {
            const parserErrorCount = eadDoc.documentElement
                .getElementsByTagName( 'parsererror' ).length;

            if ( parserErrorCount > 0 ) {
                this.results += this.getErrorHeader( 'The XML in this file is not valid.  Please check it ' +
                    'using an XML validator.' );

                return false;
            }

            return true;
        },
        ...mapActions(
            [
                'addInProcessFindingAid',
                'setHelpModal',
            ],
        ),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#header {
    margin-top : 3%;
}

#results-col {
    height : 380px;
}

#results-textarea {
    border : solid black 1px;
    font-family : "Courier";
    padding : 1%;
}

#upload-row {
    padding : 2%;
}

.button {
    margin : 1%;
}

.row {
    padding : 1%;
}
</style>

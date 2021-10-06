<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Manage in-process finding aids
            </h1>

            <b-row id="controls-row">
                <b-col
                    id="result-stats"
                    class="my-1 text-left"
                    cols="6"
                >
                    {{ totalRows.toLocaleString() }} finding aids found
                </b-col>

                <b-col
                    class="my-1 text-right"
                    cols="2"
                >
                    <b-form-group
                        id="per-page-form-group"
                        label="Per page"
                        label-align="right"
                        label-cols="6"
                        label-size="sm"
                        label-for="per-page-select"
                        class="mb-0"
                    >
                        <b-form-select
                            id="per-page-select"
                            v-model="perPage"
                            size="sm"
                            :options="pageOptions"
                        />
                    </b-form-group>
                </b-col>

                <b-col
                    class="my-1"
                >
                    <b-pagination
                        id="page-navigation"
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="my-0"
                    />
                </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table
                id="finding-aids-table"
                ref="table"
                bordered
                primary-key="id"
                striped
                show-empty
                small
                stacked="md"
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-function="customFilter"
                :sort-by.sync="sortBy"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
            >
                <template v-slot:head(id)="data">
                    <b-form-group
                        :label="data.label"
                        label-cols="auto"
                        label-align-sm="left"
                        label-for="id-filter"
                        class="mb-0"
                    >
                        <b-input-group size="sm">
                            <b-form-input
                                id="id-filter"
                                v-model="filter.id"
                                debounce="500"
                                type="search"
                            />
                        </b-input-group>
                    </b-form-group>
                </template>

                <template v-slot:head(repository)="data">
                    <b-form-group
                        :label="data.label"
                        label-cols="auto"
                        label-align-sm="left"
                        label-for="repository-filter"
                        class="mb-0"
                    >
                        <b-form-select
                            id="repository-filter"
                            v-model="filter.repository"
                            :options="repositoryFilterOptions"
                            size="sm"
                        />
                    </b-form-group>
                </template>

                <template v-slot:cell(actions)="row">
                    <span
                        id="toggle-details-button"
                        ref="toggle-details-span"
                        class="h1"
                    >
                        <b-icon
                            v-if="row.detailsShowing"
                            icon="caret-down-fill"
                            @click="row.toggleDetails"
                        />
                        <b-icon
                            v-else
                            icon="caret-right-fill"
                            @click="row.toggleDetails"
                        />
                    </span>
                </template>

                <template v-slot:cell(id)="row">
                    <div @click="row.toggleDetails">
                        {{ row.item.id }}
                    </div>
                </template>

                <template v-slot:cell(repository)="row">
                    <div @click="row.toggleDetails">
                        {{ row.item.repository }}
                    </div>
                </template>

                <template v-slot:cell(timestamp)="row">
                    <div @click="row.toggleDetails">
                        {{ row.value }}
                    </div>
                </template>

                <template v-slot:row-details="row">
                    <div>
                        <b-button
                            id="view-finding-aid-preview-button"
                            class="action-button"
                            :to="{ name : 'preview', params : { type : 'finding-aid', repositoryCode : row.item.repositoryCode, id : row.item.id } }"
                            target="_blank"
                        >
                            View finding aid preview
                        </b-button>

                        <b-button
                            id="view-ead-file-preview-button"
                            class="action-button"
                            :to="{ name : 'preview', params : { type : 'ead', repositoryCode : row.item.repositoryCode, id : row.item.id } }"
                            target="_blank"
                        >
                            View EAD file preview
                        </b-button>

                        <b-button
                            id="publish-finding-aid-button"
                            class="action-button"
                            :data-id="row.item.id"
                            :data-repository-code="row.item.repositoryCode"
                            :data-title="row.item.title"
                            @click="clickPublishInProcessFindingAid"
                        >
                            Publish finding aid
                        </b-button>

                        <b-button
                            id="delete-in-process-finding-aid-button"
                            class="action-button"
                            :data-id="row.item.id"
                            :data-repository-code="row.item.repositoryCode"
                            variant="danger"
                            @click="clickDeleteInProcessFindingAid"
                        >
                            Delete in-process finding aid
                        </b-button>
                    </div>
                </template>
            </b-table>
        </b-container>

        <b-modal
            id="confirm-delete-modal"
            header-text-variant="danger"
            size="lg"
            centered
            title="Confirm deletion"
            ok-title="Delete"
            ok-variant="danger"
            @cancel="cancelDeleteInProcessFindingAid"
            @ok="confirmDeleteInProcessFindingAid"
        >
            <p>
                Are you sure you wish to delete preview finding aid {{ findingAidToDelete.repositoryCode }}/{{ findingAidToDelete.id }}?
            </p>
            <p>This will delete the following:</p>
            <p></p>
            <ul>
                <li>
                    Preview finding aid: {{ previewFindingAidToDeleteFullURL }}
                </li>
                <li>
                    Preview EAD file: {{ previewEADFileToDeleteFullURL }}
                </li>
            </ul>
        </b-modal>

        <b-modal
            id="deletion-in-progress-modal"
            centered
            no-close-on-esc
            no-close-on-backdrop
            hide-footer
            hide-header-close
            title="Deleting in-process finding aid..."
        >
            <b-row>
                <b-col />
                <b-col align="center">
                    <b-spinner />
                </b-col>
                <b-col />
            </b-row>
        </b-modal>

        <b-modal
            id="confirm-publish-modal"
            header-text-variant="danger"
            size="lg"
            centered
            title="Confirm publication"
            ok-title="Publish"
            ok-variant="danger"
            @cancel="cancelPublishInProcessFindingAid"
            @ok="queuePublishInProcessFindingAid"
        >
            <p>
                Are you sure you wish to publish in-process finding aid
                {{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}?
            </p>
            <p>
                This will publish data to the following locations, overwriting whatever might already be there:
            </p>
            <p></p>
            <ul>
                <li>
                    Finding aid HTML:
                    http://dlib.nyu.edu/findingaids/html/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}/
                </li>
                <li>
                    Public EAD file:
                    http://dlib.nyu.edu/findingaids/ead/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}.xml
                </li>
                <li>
                    Github EAD file:
                    https://github.com/NYULibraries/findingaids_eads/blob/master/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}.xml
                </li>
            </ul>

            <p></p>

            <p>
                It will also update the search data and results in the Archival collections search located at: https://specialcollections.library.nyu.edu/search/
            </p>
        </b-modal>

        <b-modal
            id="queuing-publish-modal"
            centered
            no-close-on-esc
            no-close-on-backdrop
            hide-footer
            hide-header-close
            title="Queueing for publication..."
        >
            <b-row>
                <b-col />
                <b-col align="center">
                    <b-spinner />
                </b-col>
                <b-col />
            </b-row>
        </b-modal>

        <b-modal
            id="publication-has-been-queued-modal"
            size="lg"
            centered
            title="Publication complete"
            @ok="clickAcknowledgePublicationHasBeenQueued"
        >
            <p>
                The finding aid and the public EAD file have been published.
                The EAD file should be added to the Github repo in [X time].
                The search data will be refreshed after the repo update.
            </p>

            <p>
                Links (will pop up new browser tabs):
            </p>

            <ul>
                <li>
                    Finding aid HTML:
                    <a
                        :href="`http://dlib.nyu.edu/findingaids/html/${ findingAidToPublish.repositoryCode }/${ findingAidToPublish.id }/`"
                        target="_blank"
                    >
                        http://dlib.nyu.edu/findingaids/html/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}/
                    </a>
                </li>
                <li>
                    Public EAD file:
                    <a
                        :href="`http://dlib.nyu.edu/findingaids/ead/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}.xml`"
                        target="_blank"
                    >
                        http://dlib.nyu.edu/findingaids/ead/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}.xml
                    </a>
                </li>
                <li>
                    Github EAD file:
                    <a
                        :href="`https://github.com/NYULibraries/findingaids_eads/blob/master/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}.xml`"
                        target="_blank"
                    >
                        https://github.com/NYULibraries/findingaids_eads/blob/master/{{ findingAidToPublish.repositoryCode }}/{{ findingAidToPublish.id }}.xml
                    </a>
                </li>
                <li>
                    Archival collections search:
                    <a
                        href="https://specialcollections.library.nyu.edu/search/"
                        target="_blank"
                    >
                        https://specialcollections.library.nyu.edu/search/
                    </a>
                </li>
            </ul>

            <template v-slot:modal-footer="{ ok }">
                <b-button
                    variant="primary"
                    @click="ok()"
                >
                    OK
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import moment from 'moment';

import Navbar from './Navbar';

const FADESIGN_116_CHANGING_FINDING_AID_ID = 'fadesign_116_changed';
const FADESIGN_116_DISAPPEARING_FINDING_AID_ID = 'fadesign_116_deleted';
const FADESIGN_117_CHANGING_FINDING_AID_ID = 'fadesign_117_changed';
const FADESIGN_117_DISAPPEARING_FINDING_AID_ID = 'fadesign_117_deleted';

export default {
    name       : 'ManageInProcessFindingAids',
    components : {
        Navbar,
    },
    data() {
        return {
            blockDeletionOrPublicationOfFadesign116Changed : true,
            blockDeletionOrPublicationOfFadesign117Changed : true,
            fields                                         : [
                {
                    key   : 'actions',
                    label : '',
                    class : 'text-left text-nowrap',
                },
                {
                    key           : 'id',
                    label         : 'ID',
                    sortable      : true,
                    sortDirection : 'asc',
                    class         : 'text-left',
                },
                {
                    key           : 'repository',
                    label         : 'Repository',
                    sortable      : true,
                    sortDirection : 'asc',
                    class         : 'text-left',
                },
                {
                    key               : 'timestamp',
                    label             : 'Timestamp',
                    formatter         : ( timestamp ) => {
                        return this.$getFormattedTimestamp( timestamp );
                    },
                    sortable          : true,
                    sortDirection     : 'desc',
                    filterByFormatted : true,
                    class             : 'text-left text-nowrap',
                },
            ],
            items         : null,
            totalRows     : 0,
            currentPage   : 1,
            perPage       : 10,
            pageOptions   : [ 10, 25, 50, 100 ],
            sortBy        : 'repository',
            sortDirection : 'asc',
            filter        : {
                id         : null,
                repository : null,
                title      : null,
            },
            filterOn           : [ 'title' ],
            findingAidToDelete : {
                id             : null,
                repositoryCode : null,
            },
            findingAidToPublish : {
                id             : null,
                repositoryCode : null,
                title          : null,
            },
        };
    },
    computed   : {
        previewEADFileToDeleteFullURL() {
            return this.previewToDeleteFullURL( 'ead' );
        },
        previewFindingAidToDeleteFullURL() {
            return this.previewToDeleteFullURL( 'finding-aid' );
        },
        repositoryFilterOptions() {
            const options = this.currentRepositoryNames.map( repositoryName => {
                return {
                    value : repositoryName,
                    text  : repositoryName,
                };
            } );

            options.unshift(
                {
                    value : null,
                    text  : 'All',
                },
            );

            return options;
        },
        ...mapGetters(
            [
                'currentRepositoryCodes',
                'currentRepositoryNames',
                'currentUser',
                'inProcessFindingAids',
                'repositories',
            ],
        ),
    },
    watch      : {},
    mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );

            return;
        }

        this.refreshTableItems();

        this.totalRows = this.items.length;

        this.setHelpModal(
            {
                content : `Some things to try:

<br>
<br>

<ul>
    <li>Filter by:
        <ul>
            <li>Repository</li>
            <li>ID</li>
        </ul>
    </li>
    <li>Sort (ascending and descending) by:
        <ul>
            <li>Repository</li>
            <li>ID</li>
            <li>Timestamp</li>
        </ul>
    </li>
    <li>Select different per page options from the dropdown</li>
    <li>Navigate to different pages using page navigator buttons</li>
    <li>Expand the Actions row for one or more finding aids rows</li>
    <li>Expand the Actions row for a finding aid and click the "View finding aid preview" button</li>
    <li>Expand the Actions row for a finding aid and click the "View EAD file preview" button</li>
    <li>Expand the Actions row for a finding aid and click the "Publish finding aid" button
    (do not choose a finding aid with an ID that starts with "fadesign_116_" or "fadesign_117_")</li>
    <li>Expand the Actions row for a finding aid and click the "Delete in-process finding aid" button
    (do not choose a finding aid with an ID that starts with "fadesign_116_" or "fadesign_117_")</li>
    <li>Expand the Actions row for the finding aid with ID = "fadesign_116_changed",
    note the timestamp, and then click the "Delete in-process finding aid" button.
    This initial deletion attempt will be blocked.  After dismissing the pop-up that
    explains why the deletion was blocked, note the new timestamp on the finding aid,
    expand the Actions row, and click the "Delete in-process finding aid" button again.
    </li>
    <li>Expand the Actions row for the finding aid with ID = "fadesign_116_deleted" and click the "Delete in-process finding aid" button</li>
    <li>Expand the Actions row for the finding aid with ID = "fadesign_117_changed",
    note the timestamp, and then click the "Publish finding aid" button.
    This initial publication attempt will be blocked.  After dismissing the pop-up that
    explains why the publication was blocked, note the new timestamp on the finding aid,
    expand the Actions row, and click the "Publish finding aid" button again.
    </li>
    <li>Expand the Actions row for the finding aid with ID = "fadesign_117_deleted" and click the "Publish finding aid" button</li>
</ul>
`,
                title   : 'Manage In-Process Finding Aids screen',
            },
        );
    },
    methods    : {
        cancelDeleteInProcessFindingAid() {
            this.clearDeleteInProcess();
        },
        cancelPublishInProcessFindingAid() {
            this.clearPublishInProcess();
        },
        clearDeleteInProcess() {
            this.findingAidToDelete.id = null;
            this.findingAidToDelete.repositoryCode = null;
        },
        clearPublishInProcess() {
            this.findingAidToPublish.id = null;
            this.findingAidToPublish.repositoryCode = null;
        },
        clickAcknowledgePublicationHasBeenQueued() {
            this.refreshTableItems();
            this.$refs.table.refresh();

            this.clearPublishInProcess();
        },
        clickDeleteInProcessFindingAid( event ) {
            this.findingAidToDelete.id = event.currentTarget.dataset.id;
            this.findingAidToDelete.repositoryCode = event.currentTarget.dataset.repositoryCode;

            this.$bvModal.show( 'confirm-delete-modal' );
        },
        clickPublishInProcessFindingAid( event ) {
            this.findingAidToPublish.id = event.currentTarget.dataset.id;
            this.findingAidToPublish.repositoryCode = event.currentTarget.dataset.repositoryCode;
            this.findingAidToPublish.title = event.currentTarget.dataset.title;

            this.$bvModal.show( 'confirm-publish-modal' );
        },
        // Originally this was deleteInProcessFindingAid, which conflicts with
        // Vuex action of the same name.
        async confirmDeleteInProcessFindingAid() {
            this.$bvModal.show( 'deletion-in-progress-modal' );

            await this.$sleep( 1000 );

            this.$bvModal.hide( 'deletion-in-progress-modal' );

            let message, title;
            if ( this.findingAidToDelete.id === FADESIGN_116_CHANGING_FINDING_AID_ID &&
                 this.blockDeletionOrPublicationOfFadesign116Changed ) {
                // Don't delete the trick finding aid.
            } else {
                this.deleteInProcessFindingAid(
                    {
                        id         : this.findingAidToDelete.id,
                        repository : this.findingAidToDelete.repositoryCode,
                    },
                );

                message = 'The in-process finding aid has been deleted.';
                title = 'Deletion completed';
            }

            if (
                this.findingAidToDelete.id === FADESIGN_116_CHANGING_FINDING_AID_ID &&
                this.blockDeletionOrPublicationOfFadesign116Changed
            ) {
                this.inProcessFindingAids.archives[ FADESIGN_116_CHANGING_FINDING_AID_ID ].timestamp =
                    moment().subtract( 1, 'minutes' ).unix();
                message =
                    'The deletion of the in-process finding aid has been cancelled ' +
                    'because the EAD file on the server has been updated and ' +
                    'has a new timestamp of ' +
                    this.$getFormattedTimestamp(
                        this.inProcessFindingAids.archives[ FADESIGN_116_CHANGING_FINDING_AID_ID ].timestamp,
                    ) + '.  ' +
                    'It is recommended that you preview this updated in-process EAD file ' +
                    'before deleting it.';
                title = 'In-process finding aid deletion cancelled';

                // Allow the user to delete the finding aid after this initial attempt.
                this.blockDeletionOrPublicationOfFadesign116Changed = false;
            } else if ( this.findingAidToDelete.id === FADESIGN_116_DISAPPEARING_FINDING_AID_ID ) {
                message =
                    'The in-process finding aid may have already been deleted by another ' +
                    'user.';
                title = 'In-process finding aid not found';
            }

            this.clearDeleteInProcess();

            const that = this;
            this.$bvModal.msgBoxOk( message, {
                centered : true,
                id       : 'delete-in-process-finding-aid-message-box',
                title    : title,
            } ).then(
                function () {
                    that.refreshTableItems();

                    that.$refs.table.refresh();
                },
            );
        },
        customFilter( row, filterProp ) {
            for ( const filter in filterProp ) {
                const filterValue = filterProp[ filter ];

                if ( filterValue && ! row[ filter ].toLowerCase().includes( filterValue.toLowerCase() ) ) {
                    return false;
                }
            }

            return true;
        },
        getItems() {
            const items = [];

            Object.keys( this.inProcessFindingAids ).forEach( repositoryCode => {
                if ( this.currentRepositoryCodes.includes( repositoryCode ) ) {
                    const findingAids = this.inProcessFindingAids[ repositoryCode ];

                    Object.keys( findingAids ).forEach( id => {
                        const findingAid = findingAids[ id ];

                        items.push(
                            {
                                repository     : `${ this.repositories[ repositoryCode ].name } (${ repositoryCode })`,
                                repositoryCode : repositoryCode,
                                id             : id,
                                title          : findingAid.title,
                                timestamp       : findingAid.timestamp,
                            },
                        );
                    } );
                }
            } );

            return items;
        },
        onFiltered( filteredItems ) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        previewToDeleteFullURL( type ) {
            return window.location.href.replace( '/#/in-process', '' ) +
                   '/' +
                   this.$router.resolve(
                       {
                           name   : 'preview',
                           params : {
                               type           : type,
                               repositoryCode : this.findingAidToDelete.repositoryCode,
                               id             : this.findingAidToDelete.id,
                           },
                       },
                   ).href;
        },
        async queuePublishInProcessFindingAid() {
            this.$bvModal.show( 'queuing-publish-modal' );

            await this.$sleep( 1000 );

            this.$bvModal.hide( 'queuing-publish-modal' );

            let abortPublication, message, title;
            if ( this.findingAidToPublish.id === FADESIGN_117_CHANGING_FINDING_AID_ID ) {
                if ( this.blockDeletionOrPublicationOfFadesign117Changed  ) {
                    // Don't allow this initial attempt to publish the changed finding aid.

                    // Update the timestamp to simulate another user updating the finding
                    // aid one minute ago.
                    this.inProcessFindingAids.archives[ FADESIGN_117_CHANGING_FINDING_AID_ID ].timestamp =
                        moment().subtract( 1, 'minutes' ).unix();

                    // Allow the user to delete the finding aid after this initial attempt.
                    this.blockDeletionOrPublicationOfFadesign117Changed = false;

                    message =
                        'The publication of the in-process finding aid has been cancelled ' +
                        'because the EAD file on the server has been updated and ' +
                        'has a new timestamp of ' +
                        this.$getFormattedTimestamp(
                            this.inProcessFindingAids.archives[ FADESIGN_117_CHANGING_FINDING_AID_ID ].timestamp,
                        ) + '.  ' +
                        'It is recommended that you preview this updated in-process EAD file ' +
                        'before publishing it.';
                    title = 'Finding aid publication cancelled';

                    abortPublication = true;
                } else {
                    // Allow user to publish after block has been cleared.
                }
            } else if ( this.findingAidToPublish.id === FADESIGN_117_DISAPPEARING_FINDING_AID_ID ) {
                message = 'The in-process finding aid may have been deleted or published by another user.';
                title = 'In-process finding aid not found';

                this.deleteInProcessFindingAid(
                    {
                        id         : this.findingAidToPublish.id,
                        repository : this.findingAidToPublish.repositoryCode,
                    },
                );

                abortPublication = true;
            } else {
                // Do nothing.
            }

            if ( abortPublication ) {
                const that = this;
                this.$bvModal.msgBoxOk( message, {
                    centered : true,
                    id       : 'abort-publication-message-box',
                    title    : title,
                } ).then(
                    function () {
                        that.refreshTableItems();

                        that.$refs.table.refresh();
                    },
                );

                return;
            }

            this.publishInProcessFindingAid(
                {
                    timestamp   : Math.round( ( new Date() ).getTime() / 1000 ),
                    id         : this.findingAidToPublish.id,
                    repository : this.findingAidToPublish.repositoryCode,
                    title      : this.findingAidToPublish.title,
                },
            );

            this.deleteInProcessFindingAid(
                {
                    id         : this.findingAidToPublish.id,
                    repository : this.findingAidToPublish.repositoryCode,
                },
            );

            this.$bvModal.show( 'publication-has-been-queued-modal' );
        },
        refreshTableItems() {
            this.items = this.getItems();
        },
        ...mapActions(
            [
                'setHelpModal',
                'addInProcessFindingAid',
                'deleteInProcessFindingAid',
                'publishInProcessFindingAid',
            ],
        ),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .action-button {
        margin-bottom : 2%;
        margin-left   : 2%;
        margin-right  : 2%;
        margin-top    : 2%;
    }

    #controls-row {
        margin-bottom : 1%;
    }

    #header {
        margin-bottom : 3%;
        margin-top : 3%;
    }
</style>

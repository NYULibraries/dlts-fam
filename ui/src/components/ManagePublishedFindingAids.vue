<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <navbar />

            <h1 id="header">
                Manage published finding aids
            </h1>

            <b-row id="controls-row">
                <b-col
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
                ref="table"
                dark
                empty-filtered-text="The are no finding aids matching your request."
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
                <template
                    v-if="fetchInitialPublishedFindingAidsMetadata"
                    v-slot:emptyfiltered=""
                >
                    <h4>
                        Fetching latest Github EAD files snapshot
                        <b-spinner />
                    </h4>
                </template>

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
                            class="action-button"
                            :href="`http://dlib.nyu.edu/findingaids/html/${ row.item.repositoryCode }/${ row.item.id }/`"
                            target="_blank"
                        >
                            View finding aid
                        </b-button>

                        <b-button
                            class="action-button"
                            :href="`http://dlib.nyu.edu/findingaids/ead/${ row.item.repositoryCode }/${ row.item.id }.xml`"
                            target="_blank"
                        >
                            View EAD file
                        </b-button>

                        <b-button
                            class="action-button"
                            :data-id="row.item.id"
                            :data-repository-code="row.item.repositoryCode"
                            variant="danger"
                            @click="clickDeleteFindingAid"
                        >
                            Delete finding aid
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
            @cancel="cancelDeleteFindingAid"
            @ok="queueDeleteFindingAid"
        >
            <p>Are you sure you wish to delete {{ findingAidToDelete.repositoryCode }}/{{ findingAidToDelete.id }}?</p>
            <p>This will delete the following:</p>
            <p></p>
            <ul>
                <li>
                    Finding aid HTML:
                    http://dlib.nyu.edu/findingaids/html/{{ findingAidToDelete.repositoryCode }}/{{ findingAidToDelete.id }}/
                </li>
                <li>
                    Public EAD file:
                    http://dlib.nyu.edu/findingaids/ead/{{ findingAidToDelete.repositoryCode }}/{{ findingAidToDelete.id }}.xml
                </li>
                <li>
                    Github EAD file:
                    https://github.com/NYULibraries/findingaids_eads/blob/master/{{ findingAidToDelete.repositoryCode }}/{{ findingAidToDelete.id }}.xml
                </li>
            </ul>

            <p></p>

            <p>
                It will also delete the search data and results in the Archival collections search located at: https://specialcollections.library.nyu.edu/search/
            </p>
        </b-modal>

        <b-modal
            id="queuing-delete-modal"
            centered
            no-close-on-esc
            no-close-on-backdrop
            hide-footer
            hide-header-close
            title="Queueing for deletion..."
        >
            <b-row>
                <b-col />
                <b-col align="center">
                    <b-spinner />
                </b-col>
                <b-col />
            </b-row>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import moment from 'moment';

import Navbar from './Navbar';

const FADESIGN_118_CHANGING_FINDING_AID_ID = 'fadesign_118_changed';
const FADESIGN_118_DISAPPEARING_FINDING_AID_ID = 'fadesign_118_deleted';

export default {
    name       : 'ManagePublishedFindingAids',
    components : {
        Navbar,
    },
    data() {
        return {
            blockDeletionOfFadesign118Changed : true,
            currentPage                       : 1,
            fields                            : [
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
            filter                 : {
                id         : null,
                repository : null,
                title      : null,
            },
            filterOn               : [ 'title' ],
            findingAidToDelete  : {
                id             : null,
                repositoryCode : null,
            },
            items                  : null,
            pageOptions            : [ 10, 25, 50, 100 ],
            perPage                : 10,
            sortBy                 : 'repository',
            sortDirection          : 'asc',
            totalRows              : 0,
        };
    },
    computed   : {
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
                'fetchInitialPublishedFindingAidsMetadata',
                'publishedFindingAids',
                'repositories',
            ],
        ),
    },
    watch      : {},
    async mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );

            return;
        }

        if ( this.fetchInitialPublishedFindingAidsMetadata ) {
            await this.refreshTableItemsFromServer();

            this.setFetchInitialPublishedFindingAidsMetadata( false );
        } else {
            this.refreshTableItemsFromStore();
        }

        this.totalRows = this.items.length;

        this.setHelpModal(
            {
                content : `
<p>
The first time the user navigates to <strong>Published FAs</strong>, the FAM will
fetch the latest files metadata snapshots from the Github repo in order to populate
the finding aids table.  This is done on the initial visit to this page only.
Subsequently navigating to another screen and then returning to this one will not
trigger a refresh of the data in the table.
</p>

Some things to try:

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
    <li>Expand the Actions row for a finding aid and click the "View finding aid" button</li>
    <li>Expand the Actions row for a finding aid and click the "View EAD file" button</li>
    <li>Expand the Actions row for a finding aid and click the "Delete finding aid" button
    (do not choose a finding aid with an ID that starts with "fadesign_118_")</li>
    <li>Expand the Actions row for the finding aid with ID = "fadesign_118_changed",
    note the timestamp, and then click the "Delete finding aid" button.
    This initial deletion attempt will be blocked.  After dismissing the pop-up that
    explains why the deletion was blocked, note the new timestamp on the finding aid,
    expand the Actions row, and click the "Delete finding aid" button again.
    </li>
    <li>Expand the Actions row for the finding aid with ID = "fadesign_118_deleted" and click the "Delete finding aid" button</li>
</ul>
`,
                title   : 'Manage Published Finding Aids screen',
            },
        );
    },
    methods    : {
        cancelDeleteFindingAid() {
            this.clearDelete();
        },
        clearDelete() {
            this.findingAidToDelete.id = null;
            this.findingAidToDelete.repositoryCode = null;
        },
        clickDeleteFindingAid( event ) {
            this.findingAidToDelete.id = event.currentTarget.dataset.id;
            this.findingAidToDelete.repositoryCode = event.currentTarget.dataset.repositoryCode;

            this.$bvModal.show( 'confirm-delete-modal' );
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

            Object.keys( this.publishedFindingAids ).forEach( repositoryCode => {
                if ( this.currentRepositoryCodes.includes( repositoryCode ) ) {
                    const findingAids = this.publishedFindingAids[ repositoryCode ];

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
        getNumFindingAidsForRepositoryCode( repositoryCode ) {
            if ( this.publishedFindingAids[ repositoryCode ] ) {
                return Object.keys( this.publishedFindingAids[ repositoryCode ] )
                    .length.toLocaleString();
            } else {
                return 0;
            }
        },
        onFiltered( filteredItems ) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        async queueDeleteFindingAid() {
            this.$bvModal.show( 'queuing-delete-modal' );

            await this.$sleep( 1000 );

            this.$bvModal.hide( 'queuing-delete-modal' );

            let message, title;
            if ( this.findingAidToDelete.id === FADESIGN_118_CHANGING_FINDING_AID_ID &&
                 this.blockDeletionOfFadesign118Changed ) {
                // Don't delete the trick finding aid.
            } else {
                this.deleteFindingAid(
                    {
                        id         : this.findingAidToDelete.id,
                        repository : this.findingAidToDelete.repositoryCode,
                    },
                );

                message =
                    'The Github EAD file has been queued for deletion.' +
                    ' The finding aid, public EAD file, and search data will' +
                    ' be deleted after the Github change has been made.' +
                    ' The full delete process should be completed in [X time].';
                title = 'Deletion has been queued';
            }

            if (
                this.findingAidToDelete.id === FADESIGN_118_CHANGING_FINDING_AID_ID &&
                this.blockDeletionOfFadesign118Changed
            ) {
                this.publishedFindingAids.archives[ FADESIGN_118_CHANGING_FINDING_AID_ID ].timestamp =
                    moment().subtract( 1, 'minutes' ).unix();
                message =
                    'The deletion of the finding aid has been cancelled because the EAD file ' +
                    'in the Github repo has been updated and has a new timestamp of ' +
                    this.$getFormattedTimestamp(
                        this.publishedFindingAids.archives[ FADESIGN_118_CHANGING_FINDING_AID_ID ].timestamp,
                    ) + '.  ' +
                    'It is recommended that you preview this updated EAD file ' +
                    'before attempting to delete this finding aid.';
                title = 'Finding aid deletion cancelled';

                // Allow the user to delete the finding aid after this initial attempt.
                this.blockDeletionOfFadesign118Changed = false;
            } else if ( this.findingAidToDelete.id === FADESIGN_118_DISAPPEARING_FINDING_AID_ID ) {
                message =
                    'The finding aid may have already been deleted by another ' +
                    'user.';
                title = 'Finding aid not found';
            }

            this.clearDelete();

            const that = this;
            this.$bvModal.msgBoxOk( message, {
                centered : true,
                title    : title,
            } ).then(
                function () {
                    that.refreshTableItemsFromStore();

                    that.$refs.table.refresh();
                },
            );
        },
        async refreshTableItemsFromServer() {
            // Using for-loop instead of for-each to make it simpler for.$sleep
            // to work with the async/await.
            const numCurrentRepositoryCodes = this.currentRepositoryCodes.length;
            for ( let i = 0; i < numCurrentRepositoryCodes; i++ ) {
                const repositoryCode = this.currentRepositoryCodes[ i ];

                await this.$sleep( this.repositories[ repositoryCode ].loadTime );
            }

            this.items = this.getItems();
        },
        refreshTableItemsFromStore() {
            this.items = this.getItems();
        },
        ...mapActions(
            [
                'setHelpModal',
                'setFetchInitialPublishedFindingAidsMetadata',
                'deleteFindingAid',
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

<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <b-row
                id="feedback-row"
                align-h="center"
            >
                <b-col cols="6">
                    <div id="feedback">
                        {{ feedback }}
                    </div>

                    <b-spinner
                        v-if="showSpinner"
                        id="spinner"
                    />
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name     : 'Logout',
    data() {
        return {
            feedback    : 'Logging out of the FAM...',
            showSpinner : true,
        };
    },
    computed : {
        ...mapGetters(
            [
                'currentUser',
            ],
        ),
    },
    async mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );

            return;
        }

        await this.$sleep( 1000 );

        this.setCurrentUser( '' );
        this.setFetchInitialPublishedFindingAidsMetadata( true );

        this.showSpinner = false;

        this.feedback = 'Logout complete.  Thank you, goodbye...';

        await this.$sleep( 1000 );

        this.$router.push( 'login' );
    },
    methods : {
        ...mapActions(
            [
                'setCurrentUser',
                'setHelpModal',
                'setFetchInitialPublishedFindingAidsMetadata',
            ],
        ),
    },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#feedback-row {
    margin-top: 25%;
}

#login-link {
    margin-top: 3%;
}

#main-container {
    padding-top: 5%;
}

#spinner {
    margin-top: 3%;
}
</style>

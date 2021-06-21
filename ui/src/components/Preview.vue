<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <b-row
                id="welcome-row"
                align-v="center"
            >
                <b-col>
                    <h1>
                        Here you will see the preview for {{ previewType }} {{ $route.params.repositoryCode }}/{{ $route.params.id }}.
                        It might be at a different URL than what is used here in this mockup.
                    </h1>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name       : 'Preview',
    props      : {},
    computed : {
        previewType() {
            if ( this.$route.params.type === 'ead' ) {
                return 'EAD file';
            } else if ( this.$route.params.type === 'finding-aid' ) {
                return 'finding aid';
            } else {
                return '[UNKNOWN TYPE]';
            }
        },
        ...mapGetters(
            [
                'currentUser',
            ],
        ),
    },
    mounted() {
        // Not doing currentUser check and routing to Login if no logged
        // in user because Preview will always be opened in new tab.
        this.setHelpModal(
            {
                content : 'TODO',
                title   : 'Preview',
            },
        );
    },
    methods : {
        ...mapActions(
            [
                'setHelpModal',
            ],
        ),
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
    margin-top : 30%;
}
</style>

<template>
    <div>
        <b-navbar
            sticky
            type="light"
            variant="light"
        >
            <b-navbar-brand href="#/">
                FAM
            </b-navbar-brand>

            <b-collapse
                id="nav-collapse"
                is-nav
            >
                <b-navbar-nav>
                    <b-nav-item
                        :to="{ name: 'home' }"
                        exact
                    >
                        Home
                    </b-nav-item>
                    <b-nav-item :to="{ name: 'create' }">
                        Create FA
                    </b-nav-item>
                    <b-nav-item :to="{ name: 'in-process' }">
                        In-process FAs
                    </b-nav-item>
                    <b-nav-item :to="{ name: 'published' }">
                        Published FAs
                    </b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-text right>
                        {{ currentUser }}
                    </b-nav-text>

                    <b-nav-item
                        right
                        @click="logout"
                    >
                        Logout
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    computed : {
        ...mapGetters(
            [
                'currentUser',
            ],
        ),
    },
    methods : {
        async logout() {
            if ( this.currentUser ) {
                await this.$sleep( 500 );

                this.setCurrentUser( '' );
                this.setFetchInitialPublishedFindingAidsMetadata( true );
                this.$router.push( 'login' );
            }
        },
        ...mapActions(
            [
                'setCurrentUser',
                'setFetchInitialPublishedFindingAidsMetadata',
            ],
        ),
    },
};
</script>

<style scoped>
.nav-link {
    color : black;
}

.router-link-active {
    background-color : lightgrey;
}
</style>

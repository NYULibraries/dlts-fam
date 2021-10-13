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
                        id="home-navbar-item"
                        :to="{ name: 'home' }"
                        exact
                    >
                        Home
                    </b-nav-item>
                    <b-nav-item
                        id="create-navbar-item"
                        :to="{ name: 'create' }"
                    >
                        Create FA
                    </b-nav-item>
                    <b-nav-item
                        id="in-process-navbar-item"
                        :to="{ name: 'in-process' }"
                    >
                        In-process FAs
                    </b-nav-item>
                    <b-nav-item
                        id="published-navbar-item"
                        :to="{ name: 'published' }"
                    >
                        Published FAs
                    </b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-text
                        id="current-user-navbar-text"
                        right
                    >
                        {{ currentUser }}
                    </b-nav-text>

                    <b-nav-item
                        id="logout-navbar-item"
                        right
                        @click="logout"
                    >
                        Log Out
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
                this.$router.push( 'logout' );
            }
        },
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

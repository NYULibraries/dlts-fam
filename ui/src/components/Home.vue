<template>
    <b-container
        id="main-container"
        class="main-container h-100"
    >
        <navbar />
        <b-row
            id="welcome-row"
            align-v="center"
        >
            <b-col>
                <h1>
                    Welcome to the FAM
                </h1>
            </b-col>
        </b-row>
        <b-row
            id="options-row"
        >
            <b-col
                id="create-option"
                class="option-column"
                cols="4"
            >
                <router-link
                    class="option-link"
                    :to="{ name : 'create' }"
                >
                    Create a finding aid
                </router-link>
            </b-col>
            <b-col
                id="in-process-option"
                class="option-column"
                cols="4"
            >
                <router-link
                    class="option-link"
                    :to="{ name : 'in-process' }"
                >
                    Manage in-process finding aids
                </router-link>
            </b-col>
            <b-col
                id="published-option"
                class="option-column"
                cols="4"
            >
                <router-link
                    class="option-link"
                    :to="{ name : 'published' }"
                >
                    Manage published finding aids
                </router-link>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Navbar from './Navbar';

export default {
    name       : 'Home',
    components : {
        Navbar,
    },
    props    : {},
    computed : {
        ...mapGetters(
            [
                'currentUser',
            ],
        ),
    },
    mounted() {
        if ( ! this.currentUser ) {
            this.$router.push( { name : 'login' } );

            return;
        }

        this.setHelpModal(
            {
                content : '<p>Try navigating using the navbar and the links on the page.</p>' +
                    '<p>Try logging out and navigating back to this home page without first logging back in.</p>',
                title   : 'Home screen',
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
.option-column {
    /* Height of row = 900px * 18% */
    line-height : 162px;
}

.option-link {
    font-size : 24px;
}

#create-option {
    border-bottom : solid black 1px;
    border-left : solid black 1px;
    border-top : solid black 1px;
}

#in-process-option {
    border-bottom : solid black 1px;
    border-left : solid black 1px;
    border-right : solid black 1px;
    border-top : solid black 1px;
}

#published-option {
    border-bottom : solid black 1px;
    border-right : solid black 1px;
    border-top : solid black 1px;
}

#options-row {
    height : 18%;
}

#welcome-row {
    border-left : solid black 1px;
    border-right : solid black 1px;
    border-top : solid black 1px;
    height     : 18%;
    margin-top : 20%;
}
</style>

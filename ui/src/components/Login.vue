<template>
    <div>
        <b-container
            id="main-container"
            class="main-container h-100"
        >
            <h1>Log in to the Finding Aids Manager</h1>

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

            <b-form @submit.prevent="clickSignIn">
                <b-row
                    id="username-row"
                    align-h="center"
                >
                    <b-col cols="2">
                        <label for="username">Username</label>
                    </b-col>
                    <b-col cols="4">
                        <b-form-input
                            id="username"
                            v-model="username"
                        />
                    </b-col>
                </b-row>

                <b-row
                    align-h="center"
                    class="my-1"
                >
                    <b-col cols="2">
                        <label for="password">Password</label>
                    </b-col>
                    <b-col cols="4">
                        <b-form-input
                            id="password"
                            v-model="password"
                            type="password"
                        />
                    </b-col>
                </b-row>

                <b-row
                    align-h="center"
                    class="my-1"
                >
                    <b-col cols="6">
                        <button
                            id="sign-in-button"
                        >
                            Sign In
                        </button>
                    </b-col>
                </b-row>
            </b-form>
        </b-container>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name     : 'Login',
    data() {
        return {
            feedback : '',
            username : '',
            password : '',

            showSpinner : false,
        };
    },
    computed : {
        ...mapGetters(
            [
                'currentUser',
                'repositories',
                'users',
            ],
        ),
    },
    mounted() {
        const userList = this.users.map( user => {
            return `<li>${ user } - ${ this.getRepositoryCodesForUser( user ).join( ', ' ) }</li>`;
        } ).join( '\n' );
        this.setHelpModal(
            {
                content : `
<p>Each FAM user is granted permissions to a specific group of repositories.
This interactive mockup comes with a single user whose password is "password":</p>
<ul>
${ userList }
</ul>

<p>Some things to try:</p>

<ul>
    <li>Log in one or more times with an incorrect username or password</li>
</ul>
`,
                title   : 'Login screen',
            },
        );
    },
    methods : {
        async clickSignIn() {
            this.feedback = '';
            this.showSpinner = true;

            await this.$sleep( 300 );

            this.showSpinner = false;

            this.setCurrentUser( this.username );
            this.setCurrentRepositoryCodes( this.getRepositoryCodesForUser( this.username ) );
            this.setCurrentRepositoryNames( this.getRepositoryNamesForUser( this.username ) );

            if ( this.users.includes( this.username ) && this.password === 'password' ) {
                this.$router.push( { name : 'home' } );
            } else {
                this.feedback = 'Invalid username and password combination';
            }
        },
        getRepositoryCodesForUser( user ) {
            const repositoryCodesForUser = [];

            Object.keys( this.repositories ).forEach( repository => {
                if ( this.repositories[ repository ].archivists.includes( user ) ) {
                    repositoryCodesForUser.push( repository );
                }
            } );

            return repositoryCodesForUser.sort();
        },
        getRepositoryNamesForUser( user ) {
            const repositoryNamesForUser = [];

            Object.keys( this.repositories ).forEach( repositoryCode => {
                const repository = this.repositories[ repositoryCode ];
                if ( repository.archivists.includes( user ) ) {
                    repositoryNamesForUser.push( repository.name );
                }
            } );

            return repositoryNamesForUser.sort();
        },
        ...mapActions(
            [
                'setCurrentRepositoryCodes',
                'setCurrentRepositoryNames',
                'setCurrentUser',
                'setHelpModal',
            ],
        ),
    },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#login-header {
    margin-top: 5%;
}

#feedback {
    color: red;
}

#feedback-row {
    padding-top: 5%;
}

#main-container {
    padding-top: 5%;
}

#username-row {
    padding-top: 5%;
}

#sign-in-button {
    margin-top: 5%;
}
</style>

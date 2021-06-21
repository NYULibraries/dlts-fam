<template>
    <div id="app">
        <router-view id="router-view" />

        <b-modal
            id="help-modal"
            size="lg"
            centered
            ok-only
            scrollable
            :title="helpModal.title"
        >
            <span v-html="helpModal.content"></span>
        </b-modal>
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
    name       : 'App',
    components : {
    },
    data() {
        return {
            route : this.$route,
        };
    },
    computed : {
        ...mapGetters(
            [
                'helpModal',
            ],
        ),
    },
    watch : {
    },
    mounted() {
        this._keyListener = function ( e ) {
            if ( e.key === 'h' && ( e.ctrlKey ) ) {
                e.preventDefault(); // present "Save Page" from getting triggered.

                this.$bvModal.show( 'help-modal' );
            }
        };

        document.addEventListener( 'keydown', this._keyListener.bind( this ) );
    },
    beforeDestroy() {
        document.removeEventListener( 'keydown', this._keyListener );
    },
    methods : {
        ...mapActions(
            [
            ],
        ),
    },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height : 900px;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#router-view {
    height : 100%;
    width  : 100%;
}
</style>

import Vue from 'vue';
import Vuex from 'vuex';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from './App.vue';
import router from './router';
import storeConfig from './store/store-config';
import utils from './plugins/utils';

Vue.config.productionTip = false;

Vue.use( BootstrapVue );
Vue.use( BootstrapVueIcons );
Vue.use( Vuex );
const store = new Vuex.Store( storeConfig );

Vue.use( utils );

new Vue( {
    router,
    store,
    render : h => h( App ),
} ).$mount( '#app' );

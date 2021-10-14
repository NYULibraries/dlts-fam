import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CreateNewFindingAidView from '../views/CreateNewFindingAidView.vue';
import LoginView from '../views/LoginView';
import LogoutView from '../views/LogoutView';
import PreviewView from '../views/PreviewView';
import ManageInProcessFindingAidsView from '../views/ManageInProcessFindingAids.vue';
import ManagePublishedFindingAidsView from '../views/ManagePublishedFindingAids.vue';

Vue.use( VueRouter );

const routes = [
    {
        path      : '/',
        name      : 'home',
        component : HomeView,
    },
    {
        path      : '/create',
        name      : 'create',
        component : CreateNewFindingAidView,
    },
    {
        path      : '/in-process',
        name      : 'in-process',
        component : ManageInProcessFindingAidsView,
    },
    {
        path      : '/login',
        name      : 'login',
        component : LoginView,
    },
    {
        path      : '/logout',
        name      : 'logout',
        component : LogoutView,
    },
    {
        path      : '/preview/:type/:repositoryCode/:id',
        name      : 'preview',
        component : PreviewView,
    },
    {
        path      : '/published',
        name      : 'published',
        component : ManagePublishedFindingAidsView,
    },
];

const router = new VueRouter( {
    routes,
} );

export default router;

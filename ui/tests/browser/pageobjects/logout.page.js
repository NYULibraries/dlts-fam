/* global browser:false $:false $$:false */

import Login from './login.page';
import Page from './page';
import { getCurrentUrl, waitUntil } from '../util';

class Logout extends Page {
    get feedback() {
        return $( '#feedback' ).getText();
    }

    get path() {
        return '#/logout';
    }

    get spinner() {
        return $( '#spinner' );
    }

    logout() {
        browser.url( this.path );

        waitUntil(
            () => getCurrentUrl() === Login.fullPath,
            'User was not redirected to Login',
        );
    }
}

export default new Logout();

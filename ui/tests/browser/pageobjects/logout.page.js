/* global browser:false $:false $$:false */

import Page from './page';

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
}

export default new Logout();

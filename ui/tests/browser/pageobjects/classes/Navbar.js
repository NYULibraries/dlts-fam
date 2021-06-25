/* global $:false */

class Navbar {
    get create() {
        return $( '#create-navbar-item' );
    }

    get currentUser() {
        return $( '#current-user-navbar-text' );
    }

    get home() {
        return $( '#home-navbar-item' );
    }

    get inProcess() {
        return $( '#in-process-navbar-item' );
    }

    get logout() {
        return $( '#logout-navbar-item' );
    }

    get published() {
        return $( '#published-navbar-item' );
    }
}

export default Navbar;

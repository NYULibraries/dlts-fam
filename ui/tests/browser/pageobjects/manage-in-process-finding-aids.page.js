/* global */

import ManageFindingAidsPage from './manage-finding-aids.page';

class ManageInProcessFindingAids extends ManageFindingAidsPage {
    get path() {
        return '#/in-process';
    }
}

export default new ManageInProcessFindingAids();

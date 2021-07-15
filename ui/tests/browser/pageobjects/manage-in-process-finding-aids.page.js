/* global */

import ManageFindingAidsPage from './manage-finding-aids.page';

class ManageInProcessFindingAids extends ManageFindingAidsPage {
    get path() {
        return '#/in-process';
    }

    clickDeleteInProcessFindingAidButtonForRow( id ) {
        this.detailsRow( id ).$( '#delete-in-process-finding-aid-button' ).click();
    }

    clickPublishFindingAidButtonForRow( id ) {
        this.detailsRow( id ).$( '#publish-finding-aid-button' ).click();
    }

    clickViewFindingAidPreviewButtonForRow( id ) {
        this.detailsRow( id ).$( '#view-finding-aid-preview-button' ).click();
    }

    clickViewEadFilePreviewButtonForRow( id ) {
        this.detailsRow( id ).$( '#view-ead-file-preview-button' ).click();
    }
}

export default new ManageInProcessFindingAids();

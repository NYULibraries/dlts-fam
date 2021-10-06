import ManageFindingAidsPage from './manage-finding-aids.page';
import Modal from './classes/Modal';
import { waitUntil } from '../util';

class ManagePublishedFindingAids extends ManageFindingAidsPage {
    #confirmDeletionModal;
    #deletionCompletedModal;

    constructor() {
        super();

        // Working with modal #queueing-publish-modal in ManageInProcessFindingAids
        // has proven to be tricky, so we haven't been dealing with it in tests.
        // Likewise we won't deal with modal #deletion-in-progress-modal.
        this.#confirmDeletionModal = new Modal( 'confirm-delete-modal' );
        this.#deletionCompletedModal = new Modal( 'delete-published-finding-aid-message-box' );
    }

    get confirmDeletionModal() {
        return this.#confirmDeletionModal;
    }

    get deletionCompletedModal() {
        return this.#deletionCompletedModal;
    }

    get path() {
        return '#/published';
    }

    clickDeletePublishedFindingAidButtonForRow( id ) {
        this.detailsRow( id ).$( '#delete-published-finding-aid-button' ).click();

        waitUntil(
            // This does not work, not sure why:
            //    () => this.confirmDeleteModal.isDisplayed(),
            // Clicking of the "Delete" button right after this method returns
            // doesn't seem to work, so make sure it's clickable before returning.
            () => this.#confirmDeletionModal.button( 'Delete' ).isClickable(),
            '"Delete" button was not displayed.',
        );
    }

    viewFindingAidPreviewButtonHrefForRow( id ) {
        return this.detailsRow( id )
            .$( '#view-finding-aid-preview-button' )
            .getAttribute( 'href' );
    }

    viewEadFilePreviewButtonHrefForRow( id ) {
        return this.detailsRow( id )
            .$( '#view-ead-file-preview-button' )
            .getAttribute( 'href' );
    }
}

export default new ManagePublishedFindingAids();

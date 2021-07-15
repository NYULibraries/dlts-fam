import ManageFindingAidsPage from './manage-finding-aids.page';
import Modal from './classes/Modal';
import { waitUntil } from '../util';

class ManageInProcessFindingAids extends ManageFindingAidsPage {
    #confirmDeletionModal;
    #confirmPublishModal;
    #publicationHasBeenQueuedModal;
    #deletionCompletedModal;

    constructor() {
        super();

        // Working with modal #queueing-publish-modal has proven to be tricky, so
        // we won't deal with it in tests.  Likewise we won't deal with modal
        // #deletion-in-progress-modal.
        this.#confirmDeletionModal = new Modal( 'confirm-deletion-modal' );
        this.#confirmPublishModal = new Modal( 'confirm-publish-modal' );
        this.#deletionCompletedModal = new Modal( 'delete-in-process-finding-aid-message-box' );
        this.#publicationHasBeenQueuedModal = new Modal( 'publication-has-been-queued-modal' );
    }

    get confirmDeletionModal() {
        return this.#confirmDeletionModal;
    }

    get confirmPublishModal() {
        return this.#confirmPublishModal;
    }

    get deletionCompletedModal() {
        return this.#deletionCompletedModal;
    }

    get path() {
        return '#/in-process';
    }

    get publicationHasBeenQueuedModal() {
        return this.#publicationHasBeenQueuedModal;
    }

    clickDeleteInProcessFindingAidButtonForRow( id ) {
        this.detailsRow( id ).$( '#delete-in-process-finding-aid-button' ).click();

        waitUntil(
            // This does not work, not sure why:
            //    () => this.confirmDeleteModal.isDisplayed(),
            // Clicking of the "Delete" button right after this method returns
            // doesn't seem to work, so make sure it's clickable before returning.
            () => this.#confirmDeletionModal.button( 'Delete' ).isClickable(),
            '"Delete" button was not displayed.',
        );
    }

    clickPublishFindingAidButtonForRow( id ) {
        this.detailsRow( id ).$( '#publish-finding-aid-button' ).click();

        waitUntil(
            // This does not work, not sure why:
            //    () => this.confirmPublishModal.isDisplayed(),
            // Clicking of the "Publish" button right after this method returns
            // doesn't seem to work, so make sure it's clickable before returning.
            () => this.confirmPublishModal.button( 'Publish' ).isClickable(),
            '"Publish" button was not displayed.',
        );
    }

    clickViewFindingAidPreviewButtonForRow( id ) {
        this.detailsRow( id ).$( '#view-finding-aid-preview-button' ).click();
    }

    clickViewEadFilePreviewButtonForRow( id ) {
        this.detailsRow( id ).$( '#view-ead-file-preview-button' ).click();
    }
}

export default new ManageInProcessFindingAids();

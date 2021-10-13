/* global $:false */

class Modal {
    #id;

    // $ is not defined in the constructor, so can't create an element for this.#element
    constructor( id ) {
        this.#id = id;
    }

    get element() {
        return $( `#${ this.#id }` );
    }

    button( label ) {
        return this.element.$( `button=${ label }` );
    }

    // Making this a method call instead of a getter to keep the API consistent.
    isDisplayed() {
        return this.element.isDisplayed();
    }
}

export default Modal;

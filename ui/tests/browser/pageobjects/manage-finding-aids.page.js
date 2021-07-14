/* global $:false $$:false */

import Page from './page';

import Navbar from '../pageobjects/classes/navbar';

export default class ManageFindingAidsPage extends Page {
    constructor() {
        super();
        this.navbar = new Navbar();
    }

    get idFilter() {
        return $( '#id-filter' );
    }

    get perPageNavigation() {
        return $( '#per-page-navigation' );
    }

    get resultsPerPageSelect() {
        return $( '#per-page-select' );
    }

    get repositoryFilter() {
        return $( '#id-filter' );
    }

    get resultsPerPage() {
        return this.resultsPerPageSelect.getValue();
    }

    get resultStats() {
        return $( '#result-stats' ).getValue();
    }

    get toggleDetailsButton() {
        return $( '#toggle-details-button' );
    }

    // <tr role="row" aria-rowindex="1" className="">
    //     <td aria-colindex="1" data-label="" role="cell" className="text-left text-nowrap">
    //     ...
    //     </td>
    //     <td aria-colindex="2" data-label="ID" role="cell" className="text-left">
    //     ...
    //     </td>
    //     <td aria-colindex="3" data-label="Repository" role="cell" className="text-left">
    //     ...
    //     </td>
    //     <td aria-colindex="4" data-label="Timestamp" role="cell" className="text-left text-nowrap">
    //      ...
    //     </td>
    // </tr>
    cellForRow( id, cell ) {
        return this.row( id ).$( `[ data-label=${ cell } ]` );
    }

    clickIdCellForRow( id ) {
        this.cellForRow( id, 'ID' ).click();
    }

    clickRepositoryCellForRow( id ) {
        this.cellForRow( id, 'Repository' ).click();
    }

    clickTimestampCellForRow( id ) {
        this.cellForRow( id, 'Timestamp' ).click();
    }

    clickToggleDetailsButton( id ) {
        $( '#toggle-details-button' ).click();
    }

    filterById( id ) {
        // Previously was submitting the form using `browser.keys( '\uE006' )` in
        // SearchForm.submit method, but that seemed to cause problems in Search Form
        // tests.  See https://jira.nyu.edu/jira/browse/NYUP-619 for details.
        $( '#id-filter' ).addValue( id + '\uE006' );
    }

    filterByRepository( repository ) {
        $( '#repository-filter' ).selectByVisibleText( repository );
    }

    // <tr role="row" aria-rowindex="1" class="">
    //
    //     ...
    //
    //     <td aria-colindex="2" data-label="ID" role="cell" className="text-left">
    //          <div>
    //               <div data-v-b6dfc8aa=""> ad_mc_012 </div>
    //          </div>
    //     </td>
    //
    //     ...
    row( id ) {
        return $( `div=${ id }` ).parentElement().parentElement();
    }

    setResultsPerPage( resultsPerPage ) {
        this.resultsPerPageSelect.selectByVisibleText( resultsPerPage );
    }
}

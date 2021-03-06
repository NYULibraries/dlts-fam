/* global $:false $$:false */

import crypto from 'crypto';

import Page from './page';

import Navbar from '../pageobjects/classes/navbar';

import storeConfig from '../../../src/store/store-config';
import { waitUntil } from '../util';

export default class ManageFindingAidsPage extends Page {
    static COLUMN_LABEL_BLANK      = '';
    static COLUMN_LABEL_ID         = 'ID';
    static COLUMN_LABEL_REPOSITORY = 'Repository';
    static COLUMN_LABEL_TIMESTAMP  = 'Timestamp';

    static COLUMN_INDEX_FOR_LABEL = {
        [ ManageFindingAidsPage.COLUMN_LABEL_BLANK ]      : 1,
        [ ManageFindingAidsPage.COLUMN_LABEL_ID ]         : 2,
        [ ManageFindingAidsPage.COLUMN_LABEL_REPOSITORY ] : 3,
        [ ManageFindingAidsPage.COLUMN_LABEL_TIMESTAMP ]  : 4,
    };

    constructor() {
        super();
        this.navbar = new Navbar();
        this.repositoryCodes = {};

        for ( const [ repositoryCode, obj ] of Object.entries( storeConfig.state().repositories ) ) {
            this.repositoryCodes[ obj.name ] = repositoryCode;
        }
    }

    get idFilter() {
        return $( '#id-filter' );
    }

    get idFilterValue() {
        return this.idFilter.getValue();
    }

    get pageNavigation() {
        return $( '#page-navigation' );
    }

    get pageNumber() {
        return parseInt( $( 'li button[ aria-checked = "true" ]' ).getText() );
    }

    get resultsPerPageSelect() {
        return $( '#per-page-select' );
    }

    get repositoryFilter() {
        return $( '#repository-filter' );
    }

    get repositoryFilterValue() {
        return this.repositoryFilter.getValue();
    }

    get resultsPerPage() {
        return this.resultsPerPageSelect.getValue();
    }

    get resultStats() {
        return $( '#result-stats' ).getText();
    }

    get sort() {
        const sortField = {
            field     : null,
            direction : null,
        };

        const thElements = $$( 'th' );
        for ( let i = 0; i < thElements.length; i++ ) {
            const th = thElements[ i ];
            const ariaSort = th.getAttribute( 'aria-sort' );
            if ( ariaSort === 'ascending' || ariaSort === 'descending' ) {
                if ( th.$( 'label' ).isExisting() ) {
                    sortField.field = th.$( 'label' ).getText();
                } else {
                    // For Timestamp the label is in  a <div> not a <label>:
                    // <th role="columnheader" scope="col" tabIndex="0"
                    //     aria-colindex="4" aria-sort="descending"
                    //     className="text-left text-nowrap">
                    //     <div>Timestamp</div>
                    //     <span className="sr-only"> (Click to sort Ascending)</span>
                    // </th>
                    sortField.field = th.$( 'div' ).getText();
                }

                sortField.field = sortField.field.toLowerCase();
                sortField.direction = ariaSort;

                break;
            }
        }

        return sortField;
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

    clickBlankColumnHeader() {
        this.th( ManageFindingAidsPage.COL_INDEX_BLANK ).click();
    }

    // Called by clickGoto{First,Previous,Next,Last}Page methods
    clickGoto_Page( label ) {
        const element = this.pageNavigation.$( `[ aria-label = "${ label }" ]` );
        // this.reset() attempts to click go to first page button, which might be
        // disabled because the user is already on the first page.
        if ( element.isClickable() ) {
            element.click();
        }
    }

    clickGotoFirstPage() {
        this.clickGoto_Page( 'Go to first page' );
    }

    clickGotoLastPage() {
        this.clickGoto_Page( 'Go to last page' );
    }

    clickGotoNextPage() {
        this.clickGoto_Page( 'Go to next page' );
    }

    clickGotoPreviousPage() {
        this.clickGoto_Page( 'Go to previous page' );
    }

    clickIdCellForRow( id ) {
        this.cellForRow( id, 'ID' ).click();
    }

    clickPageNavigationLink( linkLabel ) {
        this.pageNavigation.$( `button.page-link=${ linkLabel }` ).click();
    }

    clickRepositoryCellForRow( id ) {
        this.cellForRow( id, 'Repository' ).click();
    }

    clickSortBy( colIndex ) {
        const th = this.th( colIndex );
        const width = th.getSize( 'width' );
        // The safest place to click is on table sort icons at the right edge of
        // the <th> elements.  The icons are 101px by default:
        // https://github.com/bootstrap-vue/bootstrap-vue/blob/d0fb9c264b35287f409b721e57215abf7c366375/src/_variables.scss#L90-L101
        // ...however, the comments suggest that they can be narrowed horizontally.
        // Calculate a horizontal offset that will position the click 1% of the
        // <th> width to the left of the right edge of the <th>.
        const offset = Math.floor( ( width / 2 ) - ( width * 0.01 ) );

        th.click( { x : offset } );
    }

    clickSortById() {
        this.clickSortByLabel( ManageFindingAidsPage.COLUMN_LABEL_ID );
    }

    clickSortByLabel( label ) {
        this.clickSortBy( ManageFindingAidsPage.COLUMN_INDEX_FOR_LABEL[ label ] );
    }

    clickSortByRepository() {
        this.clickSortByLabel( ManageFindingAidsPage.COLUMN_LABEL_REPOSITORY );
    }

    clickSortByTimestamp() {
        this.clickSortByLabel( ManageFindingAidsPage.COLUMN_LABEL_TIMESTAMP );
    }

    clickTimestampCellForRow( id ) {
        this.cellForRow( id, 'Timestamp' ).click();
    }

    clickToggleDetailsButton( id ) {
        this.row( id ).$( '#toggle-details-button' ).click();
    }

    closeDetailsRowIfOpen( id ) {
        if ( this.rowExists( id ) && this.detailsRow( id ).isExisting() ) {
            this.clickToggleDetailsButton( id );

            waitUntil(
                () => ! this.detailsRow( id ).isExisting(),
                `Details row for ${ id } has not been closed.`,
            );
        }
    }

    detailsRow( id ) {
        return $( `#${ this.row( id ).getAttribute( 'aria-details' ) }` );
    }

    filterById( id ) {
        const element = $( '#id-filter' );
        element.clearValue();
        // Previously was submitting the form using `browser.keys( '\uE006' )` in
        // SearchForm.submit method, but that seemed to cause problems in Search Form
        // tests.  See https://jira.nyu.edu/jira/browse/NYUP-619 for details.
        element.addValue( id + '\uE006' );
    }

    filterByRepository( repository ) {
        $( '#repository-filter' ).selectByVisibleText( repository );
    }

    getResultsId(
        idFilterValue,
        repositoryFilterValue,
        resultsPerPage,
        pageNumber,
        sortField,
        sortDirection,
    ) {
        let basename = '';

        if ( idFilterValue ) {
            const hash = crypto.createHash( 'sha256' )
                .update( idFilterValue )
                .digest( 'hex' );

            basename += `${ hash }_`;
        }

        const repositoryCode = this.repositoryCodes[ repositoryFilterValue ];
        if ( repositoryCode ) {
            basename += `${ repositoryCode }_`;
        }

        return basename + `${ resultsPerPage }-per-page_` +
            `page-${ pageNumber }_` +
            `sort-by-${ sortField }-${ sortDirection }`;
    }

    getResultsIdForCurrentOptions() {
        return this.getResultsId(
            this.idFilterValue,
            this.repositoryFilterValue,
            this.resultsPerPage,
            this.pageNumber,
            this.sort.field,
            this.sort.direction,
        );
    }

    reset() {
        this.filterById( '' );
        this.filterByRepository( 'All' );
        this.setResultsPerPage( 10 );
        this.clickGotoFirstPage();
        // Default sort is by repository, then ID, so need to click them in reverse
        // order.  Since ID is theoretically unique across all repositories, there
        // shouldn't be any need to deal with the sort for any other column (such
        // as timestamp).
        this.setSort( 'ID', 'ascending' );
        this.setSort( 'Repository', 'ascending' );
    }

    resultsSnapshot() {
        const resultRows = $$( 'tbody tr' ).map( resultRow => {
            const resultRowSnapshot = {};

            resultRow.$$( 'td' ).forEach( td => {
                const dataLabel = td.getAttribute( 'data-label' );

                if ( dataLabel ) {
                    resultRowSnapshot[ dataLabel ] = td.getText();
                }
            } );

            return resultRowSnapshot;
        } );

        return {
            ui : {
                idFilter         : this.idFilterValue || null,
                pageNavigation   : this.pageNavigation.getText(),
                pageNumber       : this.pageNumber,
                repositoryFilter : this.repositoryFilterValue || 'All',
                resultsPerPage   : this.resultsPerPage,
                resultStats      : this.resultStats,
                sort             : this.sort,
            },
            results : resultRows,
        };
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
        return $( `#finding-aids-table__row_${ id }` );
    }

    rowExists( id ) {
        return $( `#finding-aids-table__row_${ id }` ).isExisting();
    }

    setResultsPerPage( resultsPerPage ) {
        this.resultsPerPageSelect.selectByVisibleText( resultsPerPage );
    }

    setSort( field, direction ) {
        // It's not easy or maybe even possible to know the sort direction of a
        // column that was previously sorted but is not now the sort column, so
        // we first make it the active sort column, check the direction, and
        // toggle the direction if it's not the one desired.
        this.clickSortByLabel( field );
        if ( this.sort.direction !== direction ) {
            this.clickSortByLabel( field );
        }
    }

    th( colIndex ) {
        return $( `th[ aria-colindex = "${ colIndex }"` );
    }
}

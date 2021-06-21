import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import inProcessFindingAids from './in-process-finding-aids';
import publishedFindingAids from './published-finding-aids';

const TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES = 30000;

const state = function () {
    return {
        currentRepositoryCodes                   : [],
        currentRepositoryNames                   : [],
        currentUser                              : '',
        fetchInitialPublishedFindingAidsMetadata : true,
        helpModal                                : {
            content : '',
            title   : '',
        },
        inProcessFindingAids                     : inProcessFindingAids,
        // https://jira.nyu.edu/jira/browse/FADESIGN-65
        repositories                             : {
            akkasah  : {
                archivists   : [
                    'archivist',
                ],
                name         : 'Akkasah: Center for Photography (NYU Abu Dhabi)',
                organization : 'NYU',
                loadTime     : 0.068 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            archives : {
                archivists   : [
                    'archivist',
                ],
                name         : 'New York University Archives',
                organization : 'NYU',
                loadTime     : 0.101 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            bhs      : {
                archivists   : [
                    'archivist',
                ],
                name         : 'Center for Brooklyn History',
                organization : 'BHS',
                loadTime     : 0.062 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            fales    : {
                archivists   : [
                    'archivist',
                ],
                name         : 'Fales Library and Special Collections',
                organization : 'NYU',
                loadTime     : 0.238 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            lapietra : {
                archivists   : [
                    'archivist',
                ],
                name         : 'Villa La Pietra',
                organization : 'NYU',
                loadTime     : 0.013 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            nyhs     : {
                archivists   : [
                    'archivist',
                ],
                name         : 'New-York Historical Society',
                organization : 'NYHS',
                loadTime     : 0.147 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            nyuad    : {
                archivists   : [
                    'archivist',
                ],
                name         : 'NYU Abu Dhabi, Archives and Special Collections',
                organization : 'NYU',
                loadTime     : 0.003 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            poly     : {
                archivists   : [
                    'archivist',
                ],
                name         : 'Poly Archives at Bern Dibner Library of Science and Technology',
                organization : 'NYU',
                loadTime     : 0.012 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
            tamwag   : {
                archivists   : [
                    'archivist',
                ],
                name         : 'Tamiment Library and Robert F. Wagner Labor Archives',
                organization : 'NYU',
                loadTime     : 0.357 * TOTAL_LOAD_TIME_FOR_ALL_REPOSITORIES,
            },
        },
        publishedFindingAids : publishedFindingAids,
        // https://jira.nyu.edu/jira/browse/FADESIGN-63
        users                : [
            'archivist',
        ],
    };
};

export default {
    strict : process.env.NODE_ENV !== 'production',

    state,

    actions,
    getters,
    mutations,
};

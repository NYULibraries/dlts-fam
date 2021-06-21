export default {
    addInProcessFindingAid( state, findingAid ) {
        state.inProcessFindingAids[ findingAid.repository ][ findingAid.id ] = {
            timestamp : findingAid.timestamp,
            title     : findingAid.title,
        };
    },
    deleteInProcessFindingAid( state, findingAid ) {
        delete state.inProcessFindingAids[ findingAid.repository ][ findingAid.id ];
    },
    publishInProcessFindingAid( state, findingAid ) {
        state.publishedFindingAids[ findingAid.repository ][ findingAid.id ] = {
            timestamp : findingAid.timestamp,
            title     : findingAid.title,
        };
    },
    setCurrentRepositoryCodes( state, repositoryCodes ) {
        state.currentRepositoryCodes = repositoryCodes;
    },
    setCurrentRepositoryNames( state, repositoryNames ) {
        state.currentRepositoryNames = repositoryNames;
    },
    setCurrentUser( state, user ) {
        state.currentUser = user;
    },
    setFetchInitialPublishedFindingAidsMetadata( state, value ) {
        state.fetchInitialPublishedFindingAidsMetadata = value;
    },
    setHelpModal( state, helpModal ) {
        state.helpModal = helpModal;
    },
    deleteFindingAid( state, findingAid ) {
        delete state.publishedFindingAids[ findingAid.repository ][ findingAid.id ];
    },
};

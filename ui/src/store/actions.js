export default {
    addInProcessFindingAid( { commit }, findingAid ) {
        commit( 'addInProcessFindingAid', findingAid );
    },
    deleteInProcessFindingAid( { commit }, findingAid ) {
        commit( 'deleteInProcessFindingAid', findingAid );
    },
    publishInProcessFindingAid( { commit }, findingAid ) {
        commit( 'publishInProcessFindingAid', findingAid );
    },
    setCurrentRepositoryCodes( { commit }, repositoryCodes ) {
        commit( 'setCurrentRepositoryCodes', repositoryCodes );
    },
    setCurrentRepositoryNames( { commit }, repositories ) {
        commit( 'setCurrentRepositoryNames', repositories );
    },
    setCurrentUser( { commit }, user ) {
        commit( 'setCurrentUser', user );
    },
    setFetchInitialPublishedFindingAidsMetadata( { commit }, value ) {
        commit( 'setFetchInitialPublishedFindingAidsMetadata', value );
    },
    setHelpModal( { commit }, helpModal ) {
        commit( 'setHelpModal', helpModal );
    },
    deleteFindingAid( { commit }, findingAid ) {
        commit( 'deleteFindingAid', findingAid );
    },
};

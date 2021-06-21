<template>
    <div>
        <CreateNewFindingAid />
    </div>
</template>

<script>
// @ is an alias to /src
import CreateNewFindingAid from '@/components/CreateNewFindingAid.vue';

export default {
    name       : 'CreateNewFindingAidView',
    components : {
        CreateNewFindingAid,
    },
};
</script>

<template>
    <div>
        <Logout />
    </div>
</template>

<script>
// @ is an alias to /src
import Logout from '../components/Logout.vue';

export default {
    name       : 'LogoutView',
    components : {
        Logout,
    },
};
</script>

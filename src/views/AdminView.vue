<script lang="ts" setup>
import {useAuthData} from "@/stores/AuthStore";
import {useRouter} from "vue-router";

const AuthData = useAuthData();

AuthData.listen(() => {
    if (!AuthData.is_admin) {
        (window as any).message.error('仅管理员可查看此页面');
        useRouter().push('/');
    }
});
</script>

<template>
    <RouterView></RouterView>
</template>
<script lang="ts" setup>
import {useAuthData} from "@/stores/AuthStore";
import {useMessage} from "naive-ui";
import {useRouter} from "vue-router";

const AuthData = useAuthData();

AuthData.listen(() => {
    if (!AuthData.is_admin) {
        useMessage().error('仅管理员可查看此页面');
        useRouter().push('/');
    }
});
</script>

<template>
    <RouterView></RouterView>
</template>
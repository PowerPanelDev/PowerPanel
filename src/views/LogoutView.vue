<script lang="ts" setup>
import {auth} from "@/class/Client";
import {useRouter} from "vue-router";
import {onMounted} from "vue";

const router = useRouter();

onMounted(() => {
    auth.logout().then(() => {
        (window as any).message.warning('您已退出登录。');
        router.isReady().then(() => router.push('/auth'));
    });
});
</script>

<template>
    <template/>
</template>
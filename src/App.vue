<script lang="ts" setup>
import {onMounted} from 'vue';
import {useAuthData} from './stores/AuthStore';
import {useRouter} from 'vue-router';
import colors from 'tailwindcss/colors';
import type {GlobalThemeOverrides} from "naive-ui";
import GlobalMessage from "@/components/GlobalMessage.vue";
import {darkTheme} from "naive-ui";
import vhCheck from "vh-check";
import {useDarkMode} from "@/stores/DarkModeStore";

const AuthData = useAuthData();
const router = useRouter();

onMounted(() => {
    vhCheck();

    AuthData.load(() => {
        if (!AuthData.status) {
            router.isReady().then(() => router.push('/auth'));
            (window as any).message.warning('身份信息已过期，请重新登录');
        }
    });
});

const dark = useDarkMode();

const theme: GlobalThemeOverrides = {
    common: {
        primaryColor: colors.indigo[500],
        primaryColorHover: colors.indigo[500],
        primaryColorPressed: colors.indigo[500],
        primaryColorSuppl: colors.indigo[500]
    },
    Tabs: {
        tabBorderColor: 'transparent',
        tabTextColorLine: dark.status ? colors.gray[300] : '#767c82',
        tabGapMediumLine: '24px'
    },
    Progress: {
        fillColor: colors.indigo[500]
    }
};
</script>

<template>
    <n-config-provider :theme="dark.status ? darkTheme : {}" :theme-overrides="theme">
        <n-message-provider>
            <GlobalMessage/>
            <RouterView/>
        </n-message-provider>
    </n-config-provider>
</template>
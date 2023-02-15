<script lang="ts" setup>
import type {Component} from 'vue';
import {computed, h, ref} from 'vue';
import type {MenuOption} from 'naive-ui'
import {NIcon} from 'naive-ui'
import {onBeforeRouteUpdate, RouterLink, useRoute} from 'vue-router';
import {useInstanceDetail} from "@/stores/Instance/DetailStore";
import {
    AccountCircleOutlined,
    AppsRound,
    Brightness6Filled,
    DnsOutlined,
    MyLocationRound,
    SpaceDashboardOutlined
} from "@vicons/material";
import GridDots28Regular from "@/assets/icons/GridDots28Regular.vue";
import {useDarkMode} from "@/stores/DarkModeStore";

const sidebar = ref({
    left: false,
    right: false
});
const detail = useInstanceDetail();
const route = useRoute();

function renderIcon(icon: Component) {
    return () => h(NIcon, {}, {default: () => h(icon)})
}

const dark = useDarkMode();
const sidebarOption = computed<{
    left: MenuOption[]
    right: MenuOption[],
    bottom: MenuOption[]
}>(() => {
    return {
        left: [{
            label: () => h(RouterLink, {to: {name: 'instance'}}, {default: () => '实例列表'}),
            key: 'instance',
            icon: renderIcon(SpaceDashboardOutlined)
        }, ...(detail.id ? [{
            label: '实例管理',
            key: 'instance.manage',
            icon: renderIcon(DnsOutlined),
            children: [
                {
                    label: () => h(RouterLink, {
                        to: {
                            name: 'instance.detail',
                            params: {insId: detail.id}
                        }
                    }, {default: () => '实例信息'}),
                    key: 'instance.detail'
                },
                {
                    label: () => h(RouterLink, {
                        to: {
                            name: 'instance.console',
                            params: {insId: detail.id}
                        }
                    }, {default: () => '控制台'}),
                    key: 'instance.console'
                },
                {
                    label: () => h(RouterLink, {
                        to: {
                            name: 'instance.file',
                            params: {insId: detail.id}
                        }
                    }, {default: () => '文件管理'}),
                    key: 'instance.file'
                }
            ]
        }] : [])],
        right: [{
            label: () => h(RouterLink, {to: {name: 'admin.index'}}, {default: () => '管理面板'}),
            key: 'admin.index',
            icon: renderIcon(SpaceDashboardOutlined)
        }, {
            label: () => h(RouterLink, {to: {name: 'admin.instance'}}, {default: () => '实例管理'}),
            key: 'admin.instance',
            icon: renderIcon(DnsOutlined)
        }, {
            label: () => h(RouterLink, {to: {name: 'admin.user.index'}}, {default: () => '用户管理'}),
            key: 'admin.user.index',
            icon: renderIcon(AccountCircleOutlined)
        }, {
            label: '节点',
            key: 'admin.node',
            icon: renderIcon(MyLocationRound),
            children: [{
                label: () => h(RouterLink, {to: {name: 'admin.node.group'}}, {default: () => '节点组管理'}),
                key: 'admin.node.group'
            }, {
                label: () => h(RouterLink, {to: {name: 'admin.node.index'}}, {default: () => '节点管理'}),
                key: 'admin.node.index'
            }]
        }, {
            label: '应用镜像',
            key: 'admin.app',
            icon: renderIcon(AppsRound),
            children: [{
                label: () => h(RouterLink, {to: {name: 'admin.app.game'}}, {default: () => '游戏管理'}),
                key: 'admin.app.game'
            }, {
                label: () => h(RouterLink, {to: {name: 'admin.app.index'}}, {default: () => '镜像管理'}),
                key: 'admin.app.index'
            }, {
                label: () => h(RouterLink, {to: {name: 'admin.app.version'}}, {default: () => '版本管理'}),
                key: 'admin.app.version'
            }]
        }],
        bottom: [{
            label: '切换' + (dark.status ? '浅' : '深') + '色',
            key: 'darkmode.toggle',
            icon: renderIcon(Brightness6Filled)
        }]
    }
});

const selected = computed(() => route.name?.toString());

onBeforeRouteUpdate(() => {
    sidebar.value = {
        left: false,
        right: false
    };
});

const action = computed({
    get() {
        return '';
    },
    set(v) {
        if (v == 'darkmode.toggle') {
            dark.toggle();
        }
    }
});
</script>

<template>
    <n-layout>
        <header class="flex items-center bg-indigo-600 text-neutral-100 py-4 px-[22px]">
            <n-button text color="#fff">
                <n-icon size="20" @click="sidebar.left = true">
                    <GridDots28Regular/>
                </n-icon>
            </n-button>
            <router-link :to="{name: 'instance'}" class="ml-[22px] font-semibold text-lg">
                Power
            </router-link>
            <div class="grow"></div>
            <n-button text color="#fff">
                <n-icon size="20" @click="sidebar.right = true">
                    <GridDots28Regular/>
                </n-icon>
            </n-button>
        </header>

        <section>
            <n-drawer v-model:show="sidebar.left" :default-width="268" placement="left">
                <div class="flex flex-col h-full">
                    <div class="flex items-center px-[22px] min-h-[60px] border-b border-solid"
                         :class="{'text-neutral-500': !dark.status, 'border-gray-400': dark.status, 'border-gray-200': !dark.status}">
                        <n-icon size="20">
                            <GridDots28Regular/>
                        </n-icon>
                        <div class="font-semibold text-lg ml-[22px]">Power</div>
                    </div>
                    <n-menu class="menu grow" :options="sidebarOption.left" :root-indent="20" :indent="32"
                            :value="selected"/>
                    <n-menu class="menu mb-1.5" :options="sidebarOption.bottom" v-model:value="action" :root-indent="20"
                            :indent="32"></n-menu>
                </div>
            </n-drawer>
            <n-drawer v-model:show="sidebar.right" :default-width="268" placement="right">
                <div class="flex items-center px-[22px] min-h-[60px] border-b border-solid"
                     :class="{'text-neutral-500': !dark.status, 'border-gray-400': dark.status, 'border-gray-200': !dark.status}">
                    <n-icon size="20">
                        <GridDots28Regular/>
                    </n-icon>
                    <div class="font-semibold text-lg ml-[22px]">Admin</div>
                </div>
                <n-menu class="menu" :options="sidebarOption.right" :root-indent="20" :indent="32" :value="selected"/>
            </n-drawer>
        </section>

        <section class="pb-4">
            <RouterView/>
        </section>
    </n-layout>
</template>

<style scoped>
.menu {
    user-select: none;
}

.menu :deep(.n-menu-item-content-header) {
    margin-left: 12px;
}
</style>
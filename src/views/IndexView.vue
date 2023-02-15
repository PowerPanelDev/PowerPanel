<script lang="ts" setup>
import {useAuthData} from '@/stores/AuthStore';
import {ref} from 'vue';
import {ins} from '@/class/Client';
import {ByteFormat} from '@/class/ByteFormat';
import PageHeader from '@/components/PageHeader.vue';
import PageContainer from "@/components/PageContainer.vue";
import {InstanceStatus as S} from "@/class/Constant/Status";
import {useDarkMode} from "@/stores/DarkModeStore";

interface Instance {
    id: number,
    name: string,
    uuid: string,
    cpu: number,
    memory: number,
    disk: number,
    stats: {
        status: number,
        disk_usage: number
    }
}

const AuthData = useAuthData();
const list = ref<Instance[]>([]);
const statusChart = {
    [S.INSTALLING]: {
        type: 'warning',
        slot: '安装中'
    },
    [S.STARTING]: {
        type: 'primary',
        slot: '启动中'
    },
    [S.RUNNING]: {
        type: 'success',
        slot: '运行中'
    },
    [S.STOPPING]: {
        type: 'warning',
        slot: '关闭中'
    },
    [S.STOPPED]: {
        type: 'error',
        slot: '已关机'
    },
};

AuthData.listen(() => {
    ins.list().then(res => {
        list.value = res.data.data;
    });
});

const dark = useDarkMode();
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['控制面板', '实例列表']">
            <template #title>实例列表</template>
            <template #action>
                <n-button type="primary" text-color="white" v-if="AuthData.is_admin" size="large">新建实例</n-button>
            </template>
        </PageHeader>
        <div v-if="list.length" class="mt-6">
            <div class="grid md:grid-cols-2 gap-4">
                <RouterLink :to="{name: 'instance.detail', params: {insId: ins.id}}"
                            class="border-2 hover:border-transparent outline outline-0 hover:outline-[4px] outline-indigo-400 transition-all duration-100 rounded-md px-4 py-3 last:mb-0"
                            :class="dark.status ? ['border-gray-400'] : ['border-gray-200']"
                            v-for="ins in list" :key="ins.id">
                    <div class="text-lg flex items-center" :class="dark.status ? ['text-gray-300'] : ['text-gray-600']">
                        <n-tag :type="statusChart[ins.stats.status].type" size="small"
                               class="mr-[.4rem]">
                            {{ statusChart[ins.stats.status].slot }}
                        </n-tag>
                        {{ (ins.name) || ins.uuid.split('-')[0] }}
                    </div>
                    <div class="text-base" :class="dark.status ? ['text-gray-300'] : ['text-gray-500']">
                        {{ ins.cpu }}% CPU ·
                        {{ ByteFormat(ins.memory * 1024 * 1024, true) }} 内存 ·
                        {{ ByteFormat(ins.disk * 1024 * 1024, true) }} 存储
                    </div>
                </RouterLink>
            </div>
        </div>
        <div v-else class="mt-5">
            <div
                class="border-4 border-dashed hover:outline-[4px] hover:border-indigo-400 transition-all duration-150 rounded-md px-2 py-8 last:mb-0 text-center"
                :class="{ 'border-gray-400': dark.status, 'border-gray-200': !dark.status }">
                <div class="text-gray-500">此账号下无有效实例。</div>
            </div>
        </div>
    </PageContainer>
</template>
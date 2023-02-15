<script setup lang="ts">
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PAdminStatus from "@/components/Admin/PAdminStatus.vue";
import {useAuthData} from "@/stores/AuthStore";
import {admin} from "@/class/Client";
import {ref} from "vue";
import {ArrowForwardOutlined} from "@vicons/material";
import PLink from "@/components/PLink.vue";
import {useDarkMode} from "@/stores/DarkModeStore";

interface INode {
    id: number,
    name: string,
    load: number
}

interface IData {
    node: INode[],
    instance: {
        count: {
            running: number | null,
            total: number | null
        }
    }
}

const AuthData = useAuthData();
const data = ref<IData>();

AuthData.listen(() => {
    admin.fetch().then(res => {
        data.value = res.data.attributes;
    });
});

const dark = useDarkMode();
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '总览']">
            <template #title>面板总览</template>
        </PageHeader>
    </PageContainer>

    <n-divider class="my-0"/>

    <div class="mdui-container md:columns-3 gap-4 mt-4" v-if="data">
        <PAdminStatus>
            <template #label>节点数量总计</template>
            <template #value>
                <n-number-animation :duration="1500" :to="data?.node.length"/>
            </template>
            <template #addition>
                <div class="mt-2" :class="{ 'text-gray-600': !dark.status }">节点负载</div>
                <div v-for="node in data?.node" :key="node.id" class="mt-1" :class="{ 'text-gray-500': !dark.status }">
                    <div class="flex justify-between">
                        <div>{{ node.name }}</div>
                        <div>{{ node.load }}</div>
                    </div>
                    <n-progress type="line" :percentage="node.load * 100" :show-indicator="false" :height="2"
                                class="mt-1" border-radius="0"></n-progress>
                </div>
            </template>
            <template #action>
                <div class="mt-4">
                    <PLink element="button" :to="{name: 'admin.node.index'}" ghost>
                        管理节点
                        <n-icon class="ml-1">
                            <ArrowForwardOutlined/>
                        </n-icon>
                    </PLink>
                </div>
            </template>
        </PAdminStatus>

        <PAdminStatus>
            <template #label>运行中实例 / 总计</template>
            <template #value>
                <n-number-animation :duration="1500" :to="data?.instance.count.running"/>
                <span class="font-normal mx-[2px]">/</span>
                <n-number-animation :duration="1500" :to="data?.instance.count.total"/>
            </template>
            <template #action>
                <PLink element="button" :to="{name: 'admin.instance'}" ghost>
                    管理实例
                    <n-icon class="ml-1">
                        <ArrowForwardOutlined/>
                    </n-icon>
                </PLink>
            </template>
        </PAdminStatus>
    </div>
</template>
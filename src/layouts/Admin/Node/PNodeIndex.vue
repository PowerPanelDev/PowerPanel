<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PNodeList from "@/components/Admin/Node/PNodeList.vue";
import {computed, nextTick, ref} from "vue";
import {admin} from "@/class/Client";
import {useRoute, useRouter} from "vue-router";
import {useAuthData} from "@/stores/AuthStore";
import PNodeEditor from "@/components/Admin/Node/PNodeEditor.vue";

const data = ref([]);
const load = () => admin.node.list().then(res => {
    data.value = res.data.data;
});
const route = useRoute();
const router = useRouter();

let id;

useAuthData().listen(() => {
    load()
    nextTick(() => id = computed({
        get: () => route.params.nodeId,
        set: (v) => router.isReady().then(() => router.push({name: 'admin.node.index', params: {nodeId: v}}))
    }));
});
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '节点管理']">
            <template #title>节点列表</template>
            <template #action>
                <n-button type="primary" @click="id = 'create'">新建节点</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <hr/>

    <div class="mdui-container mt-4">
        <PNodeList :data="data"/>
        <PNodeEditor v-model:id="id" @reload="load"/>
    </div>
</template>
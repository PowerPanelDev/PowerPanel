<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PNodeGroupList from "@/components/Admin/Node/PNodeGroupList.vue";
import {computed, nextTick, ref} from "vue";
import {admin} from "@/class/Client";
import {useRoute, useRouter} from "vue-router";
import {useAuthData} from "@/stores/AuthStore";
import PNodeGroupEditor from "@/components/Admin/Node/PNodeGroupEditor.vue";

const data = ref([]);
const load = () => admin.node.group.list().then(res => {
    data.value = res.data.data;
});
const route = useRoute();
const router = useRouter();

let id;

useAuthData().listen(() => {
    load()
    nextTick(() => id = computed({
        get: () => route.params.groupId,
        set: (v) => router.isReady().then(() => router.push({name: 'admin.node.group', params: {groupId: v}}))
    }));
});
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '节点管理', '节点组管理']">
            <template #title>节点组列表</template>
            <template #action>
                <n-button type="primary" @click="id = 'create'">新建节点组</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <hr/>

    <div class="mdui-container mt-4">
        <PNodeGroupList :data="data"/>
        <PNodeGroupEditor v-model:id="id" @reload="load"/>
    </div>
</template>
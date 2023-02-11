<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PAppList from "@/components/Admin/App/PAppList.vue";
import {computed, nextTick, ref} from "vue";
import {admin} from "@/class/Client";
import {useRoute, useRouter} from "vue-router";
import {useAuthData} from "@/stores/AuthStore";
import PAppEditor from "@/components/Admin/App/PAppEditor.vue";

const data = ref([]);
const load = () => admin.app.list().then(res => {
    data.value = res.data.data;
});
const route = useRoute();
const router = useRouter();

let id;

useAuthData().listen(() => {
    load()
    nextTick(() => id = computed({
        get: () => route.params.appId,
        set: (v) => router.isReady().then(() => router.push({name: 'admin.app.index', params: {appId: v}}))
    }));
});
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '镜像管理']">
            <template #title>镜像列表</template>
            <template #action>
                <n-button type="primary" @click="id = 'create'">新建镜像</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <hr/>

    <div class="mdui-container mt-4">
        <PAppList :data="data"/>
        <PAppEditor v-model:id="id" @reload="load"/>
    </div>
</template>
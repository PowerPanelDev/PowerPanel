<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PAppVersionList from "@/components/Admin/App/PAppVersionList.vue";
import {computed, nextTick, ref} from "vue";
import {admin} from "@/class/Client";
import {useRoute, useRouter} from "vue-router";
import {useAuthData} from "@/stores/AuthStore";
import PAppVersionEditor from "@/components/Admin/App/PAppVersionEditor.vue";

const data = ref([]);
const load = () => admin.app.version.list((res) => {
    data.value = res.data.data;
});
const route = useRoute();
const router = useRouter();

let id;

useAuthData().listen(() => {
    load()
    nextTick(() => id = computed({
        get: () => route.params.versionId,
        set: (v) => router.isReady().then(() => router.push({name: 'admin.app.version', params: {versionId: v}}))
    }));
});
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '镜像管理', '版本管理']">
            <template #title>版本列表</template>
            <template #action>
                <n-button type="primary" @click="id = 'create'">新建版本</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <hr/>

    <div class="mdui-container mt-4">
        <PAppVersionList :data="data"/>
        <PAppVersionEditor v-model:id="id" @reload="load"/>
    </div>
</template>
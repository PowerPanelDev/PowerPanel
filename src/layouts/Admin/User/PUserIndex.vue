<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import {computed, nextTick, ref} from "vue";
import {admin} from "@/class/Client";
import {useRoute, useRouter} from "vue-router";
import {useAuthData} from "@/stores/AuthStore";
import PUserList from "@/components/Admin/App/PUserList.vue";
import PUserEditor from "@/components/Admin/App/PUserEditor.vue";

const data = ref([]);
const load = () => admin.user.list().then(res => {
    data.value = res.data.data;
});
const route = useRoute();
const router = useRouter();

let id;

useAuthData().listen(() => {
    load()
    nextTick(() => id = computed({
        get: () => route.params.userId,
        set: (v) => router.isReady().then(() => router.push({name: 'admin.user.index', params: {userId: v}}))
    }));
});
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '用户管理']">
            <template #title>用户管理</template>
            <template #action>
                <n-button type="primary" @click="id = 'create'">新建用户</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <hr/>

    <div class="mdui-container mt-4">
        <PUserList :data="data"/>
        <PUserEditor v-model:id="id" @reload="load"/>
    </div>
</template>
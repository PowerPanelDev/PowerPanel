<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PAppGameList from "@/components/Admin/App/PAppGameList.vue";
import {computed, nextTick, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import PAppGameEditor from "@/components/Admin/App/PAppGameEditor.vue";
import {useAuthData} from "@/stores/AuthStore";
import {admin} from "@/class/Client";

const data = ref([]);
const load = () => admin.app.game.list((res) => {
    data.value = res.data.data;
});
const route = useRoute();
const router = useRouter();

let id;

useAuthData().listen(() => {
    load()
    nextTick(() => id = computed({
        get: () => route.params.gameId,
        set: (v) => router.isReady().then(() => router.push({name: 'admin.app.game', params: {gameId: v}}))
    }));
});
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '镜像管理', '游戏管理']">
            <template #title>游戏列表</template>
            <template #action>
                <n-button type="primary" @click="id = 'create'">新建游戏</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <hr/>

    <div class="mdui-container mt-4">
        <PAppGameList :data="data"/>
        <PAppGameEditor v-model:id="id" @reload="load"/>
    </div>
</template>
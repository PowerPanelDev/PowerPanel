<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {admin} from "@/class/Client";
import {useMessage} from "naive-ui";
import AllowSubmit from "@/components/AllowSubmit.vue";

const props = defineProps(['id']);
const emits = defineEmits(['update:id', 'reload']);
const message = useMessage();

const initData = {
    id: 0,
    name: '',
    description: '',
    updated_at: 0,
    created_at: 0
};
const data = ref(initData);
const actions = {
    init() {
        data.value = initData;
        actions.load();
    },
    load() {
        if (create.value) return;
        admin.app.game.detail(props.id, res => {
            data.value = res.data.attributes;
        })
    },
    confirm() {
        if (create.value) {
            admin.app.game.create(data.value, () => {
                actions.close('游戏创建成功。', true);
            });
        } else {
            admin.app.game.update(props.id, data.value, () => {
                actions.close('游戏修改成功。', true);
            });
        }
    },
    delete() {
        admin.app.game.delete(props.id, () => {
            actions.close('游戏删除成功。', true);
        });
    },
    close(msg?: string, reload?: boolean) {
        if (msg) message.success(msg);
        if (reload) emits('reload');
        emits('update:id', null);
    }
};
const width: number = window.innerWidth;
const create = computed(() => props.id == 'create');

watch(() => props.id, (v) => !v || actions.init());
</script>

<template>
    <n-drawer :default-width="Math.min(768, width)" resizable placement="right" :mask-closable="false"
              :show="!!id" @update:show="actions.close">
        <n-drawer-content closable :native-scrollbar="false">
            <template #header>{{ create ? '创建游戏' : '修改游戏' }}</template>

            <n-form :model="data" label-placement="left" :label-width="68" class="mt-2"
                    @submit.prevent="actions.confirm()">
                <n-form-item label="ID" v-if="!create">
                    <n-input-number v-model:value="data.id" readonly/>
                </n-form-item>

                <n-form-item label="游戏名称">
                    <n-input v-model:value="data.name" placeholder="输入游戏名称"/>
                </n-form-item>

                <n-form-item label="游戏简介">
                    <n-input v-model:value="data.description" placeholder="输入游戏简介" type="textarea"/>
                </n-form-item>

                <n-form-item label="更新时间" v-if="!create">
                    <n-time :time="new Date(data.updated_at)"/>
                </n-form-item>

                <n-form-item label="创建时间" class="-mt-4" v-if="!create">
                    <n-time :time="new Date(data.created_at)"/>
                </n-form-item>

                <AllowSubmit/>
            </n-form>

            <template #footer>
                <n-button type="error" ghost @click="actions.delete()" v-if="!create">删除</n-button>
                <n-button type="primary" @click="actions.confirm()">{{ create ? '创建' : '修改' }}</n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>
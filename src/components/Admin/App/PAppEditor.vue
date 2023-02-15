<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {admin} from "@/class/Client";
import {useMessage} from "naive-ui";
import type {MentionOption} from 'naive-ui';
import {DataPath} from "@/class/DataPath";
import AllowSubmit from "@/components/AllowSubmit.vue";
import PSelector from "@/components/PSelector.vue";
import PSwitch from "@/components/PSwitch.vue";

const props = defineProps(['id']);
const emits = defineEmits(['update:id', 'reload']);
const message = useMessage();

const initData = {
    id: 0,
    game_id: '',
    name: '',
    description: '',
    data_path: '{"":""}',
    working_path: '',
    images: '[""]',
    config: '{}',
    startup: '',
    skip_install: false,
    install_image: '',
    install_script: '',
    updated_at: 0,
    created_at: 0
};
const data = ref(initData);
const dataPath = ref();
const games = ref<MentionOption[]>([]);
const actions = {
    init() {
        data.value = initData;
        tab.value = 'general';
        actions.load();
    },
    load() {
        admin.app.game.list().then(res => {
            games.value = res.data.data.map((v: { id: number, name: string }) => {
                return {label: v.id + '-' + v.name, value: v.id};
            });
        });
        if (create.value) {
            dataPath.value = DataPath.Parse(data.value.data_path);
            return;
        }
        admin.app.detail(props.id).then(res => {
            data.value = res.data.attributes;
            dataPath.value = DataPath.Parse(data.value.data_path);
        });
    },
    confirm() {
        data.value.data_path = DataPath.Build(dataPath.value);
        if (create.value) {
            admin.app.create(data.value).then(() => {
                actions.close('镜像创建成功。', true);
            });
        } else {
            admin.app.update(props.id, data.value).then(() => {
                actions.close('镜像修改成功。', true);
            });
        }
    },
    delete() {
        admin.app.delete(props.id).then(() => {
            actions.close('镜像删除成功。', true);
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

const images = computed({
    get() {
        return JSON.parse(data.value.images);
    },
    set(v) {
        data.value.images = JSON.stringify(v);
    }
});

const config = computed({
    get() {
        return JSON.stringify(JSON.parse(data.value.config), null, '    ');
    },
    set(v) {
        data.value.config = JSON.stringify(JSON.parse(v));
    }
});

const tab = ref('general');
</script>

<template>
    <n-drawer :default-width="Math.min(768, width)" resizable placement="right" :mask-closable="false"
              :show="!!id" @update:show="actions.close">
        <n-drawer-content closable :native-scrollbar="false">
            <template #header>{{ create ? '创建镜像' : '修改镜像' }}</template>

            <n-tabs type="segment" v-model:value="tab" animated>
                <n-tab name="general">基础设置</n-tab>
                <n-tab name="runtime">运行设置</n-tab>
                <n-tab name="install">安装设置</n-tab>
            </n-tabs>

            <n-form :model="data" label-placement="left" :label-width="68" class="mt-6"
                    @submit.prevent="actions.confirm()">
                <n-form-item label="ID" v-if="!create && tab === 'general'">
                    <n-input-number v-model:value="data.id" readonly/>
                </n-form-item>

                <n-form-item label="镜像名称" v-if="tab === 'general'">
                    <n-input v-model:value="data.name" placeholder="输入镜像名称"/>
                </n-form-item>

                <n-form-item label="镜像简介" v-if="tab === 'general'">
                    <n-input v-model:value="data.description" placeholder="输入镜像简介" type="textarea"/>
                </n-form-item>

                <n-form-item label="所属游戏" v-if="tab === 'general'">
                    <PSelector v-model="data.game_id" :list="games"/>
                </n-form-item>

                <n-form-item label="启动命令" v-if="tab === 'runtime'">
                    <n-input v-model:value="data.startup" placeholder="输入启动命令"/>
                </n-form-item>

                <n-form-item label="目录映射" v-if="tab === 'runtime'">
                    <n-dynamic-input v-model:value="dataPath" preset="pair" key-placeholder="容器外路径"
                                     value-placeholder="容器内路径" :min="1"/>
                </n-form-item>

                <n-form-item label="工作目录" v-if="tab === 'runtime'">
                    <n-input v-model:value="data.working_path" placeholder="输入工作目录"/>
                </n-form-item>

                <n-form-item label="可用镜像" v-if="tab === 'runtime'">
                    <n-dynamic-input v-model:value="images" placeholder="输入 Docker 镜像" :min="1"/>
                </n-form-item>

                <n-form-item label="配置项" v-if="tab === 'runtime'">
                    <n-input v-model:value="config" placeholder="输入配置项" type="textarea" :autosize="{minRows: 6}"/>
                </n-form-item>

                <n-form-item label="跳过安装" v-if="tab === 'install'">
                    <PSwitch v-model="data.skip_install" element="switch"/>
                </n-form-item>

                <n-form-item label="安装镜像" v-if="tab === 'install'">
                    <n-input v-model:value="data.install_image" placeholder="输入安装镜像"/>
                </n-form-item>

                <n-form-item label="安装脚本" v-if="tab === 'install'">
                    <n-input v-model:value="data.install_script" type="textarea" placeholder="输入安装脚本"
                             :autosize="{minRows: 16}"/>
                </n-form-item>

                <n-form-item label="更新时间" v-if="!create && tab === 'general'">
                    <n-time :time="new Date(data.updated_at)"/>
                </n-form-item>

                <n-form-item label="创建时间" class="-mt-4" v-if="!create && tab === 'general'">
                    <n-time :time="new Date(data.created_at)"/>
                </n-form-item>

                <AllowSubmit/>
            </n-form>

            <template #footer>
                <n-button type="error" ghost @click="actions.delete()" v-if="!create">删除</n-button>
                <n-button type="primary" text-color="white" @click="actions.confirm()">{{ create ? '创建' : '修改' }}</n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>
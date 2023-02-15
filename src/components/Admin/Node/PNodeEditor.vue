<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {admin} from "@/class/Client";
import {useMessage} from "naive-ui";
import type {MentionOption} from 'naive-ui';
import AllowSubmit from "@/components/AllowSubmit.vue";
import PSelector from "@/components/PSelector.vue";
import {ByteFormat} from "@/class/ByteFormat";
import PSwitch from "@/components/PSwitch.vue";

const props = defineProps(['id']);
const emits = defineEmits(['update:id', 'reload']);
const message = useMessage();

const initData = {
    id: 0,
    name: '',
    description: '',
    node_group_id: '',
    endpoint: '',
    enable_tls: 0,
    node_token: '',
    panel_token: '',
    os: '',
    memory: 0,
    memory_overallocate: 0,
    disk: 0,
    disk_overallocate: 0,
    created_at: 0,
    updated_at: 0
};
const data = ref(initData);
const groups = ref<MentionOption[]>();
const actions = {
    init() {
        data.value = initData;
        actions.load();
    },
    load() {
        admin.node.group.list().then(res => {
            groups.value = res.data.data.map((v: { id: number, name: string }) => {
                return {label: v.id + '-' + v.name, value: v.id};
            });
        });
        if (create.value) return;
        admin.node.detail(props.id).then(res => {
            data.value = res.data.attributes;
        });
    },
    confirm() {
        if (create.value) {
            admin.node.create(data.value).then(() => {
                actions.close('节点创建成功。', true);
            });
        } else {
            admin.node.update(props.id, data.value).then(() => {
                actions.close('节点修改成功。', true);
            });
        }
    },
    delete() {
        admin.node.delete(props.id).then(() => {
            actions.close('节点删除成功。', true);
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

const endpoint = window.location.origin;
</script>

<template>
    <n-drawer :default-width="Math.min(768, width)" resizable placement="right" :mask-closable="false"
              :show="!!id" @update:show="actions.close">
        <n-drawer-content closable :native-scrollbar="false">
            <template #header>{{ create ? '创建节点' : '修改节点' }}</template>

            <n-form :model="data" label-placement="left" :label-width="84" class="mt-2"
                    @submit.prevent="actions.confirm()">
                <n-form-item label="ID" v-if="!create">
                    <n-input-number v-model:value="data.id" readonly/>
                </n-form-item>

                <n-form-item label="名称">
                    <n-input v-model:value="data.name" placeholder="输入节点名称"/>
                </n-form-item>

                <n-form-item label="节点简介">
                    <n-input v-model:value="data.description" placeholder="输入节点简介" type="textarea"/>
                </n-form-item>

                <n-form-item label="所属节点组">
                    <PSelector :list="groups" v-model="data.node_group_id"/>
                </n-form-item>

                <n-form-item label="连接地址">
                    <n-input v-model:value="data.endpoint" placeholder="输入 IP:端口 / 域名:端口"/>
                </n-form-item>

                <n-form-item label="启用 TLS">
                    <PSwitch v-model="data.enable_tls" element="switch"/>
                </n-form-item>

                <n-form-item label="面板密钥" v-if="!create">
                    <n-input :value="data.panel_token" readonly/>
                </n-form-item>

                <n-form-item label="节点密钥" v-if="!create">
                    <n-input :value="data.node_token" readonly/>
                </n-form-item>

                <n-form-item label="操作系统">
                    <n-radio :checked="data.os === 'linux'" @change="data.os = 'linux'">Linux</n-radio>
                    <n-radio :checked="data.os === 'windows'" @change="data.os = 'windows'">Windows</n-radio>
                </n-form-item>

                <n-form-item label="内存限制">
                    <div>
                        <n-space>
                            <n-input-number v-model:value="data.memory" min="0"
                                            placeholder="输入内存限制"/>
                            <n-input-number v-model:value="data.memory_overallocate" min="0"
                                            placeholder="输入超售百分比 0为不启用"/>
                        </n-space>
                        <div class="mt-1.5">
                            <i>最终内存可分配大小：<b>
                                {{ ByteFormat(data.memory * (data.memory_overallocate / 100 + 1) * 1024 * 1024) }}
                            </b></i>
                        </div>
                    </div>
                </n-form-item>

                <n-form-item label="硬盘限制">
                    <div>
                        <n-space>
                            <n-input-number :step="1024" v-model:value="data.disk" min="0"
                                            placeholder="输入硬盘限制"/>
                            <n-input-number v-model:value="data.disk_overallocate" min="0"
                                            placeholder="输入超售百分比 0为不启用"/>
                        </n-space>
                        <div class="mt-1.5">
                            <i>最终硬盘可分配大小：<b>
                                {{ ByteFormat(data.disk * (data.disk_overallocate / 100 + 1) * 1024 * 1024) }}
                            </b></i>
                        </div>
                    </div>
                </n-form-item>

                <n-form-item label="更新时间" v-if="!create">
                    <n-time :time="new Date(data.updated_at)"/>
                </n-form-item>

                <n-form-item label="创建时间" class="-mt-4" v-if="!create">
                    <n-time :time="new Date(data.created_at)"/>
                </n-form-item>

                <n-form-item label="部署命令">
                    <n-input :value="'./node ' + endpoint + ' ' + data.panel_token" type="textarea" autosize readonly/>
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
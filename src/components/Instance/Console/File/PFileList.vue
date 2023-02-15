<script lang="ts" setup>
import {h, nextTick, onMounted, ref} from "vue";
import type {DataTableColumns, DataTableRowKey, DropdownOption} from 'naive-ui';
import {NTime, useMessage} from "naive-ui";
import {ins} from "@/class/Client";
import {Base64} from "@/class/Base64";
import {useRoute} from "vue-router";
import {ByteFormat} from "@/class/ByteFormat";
import LoadingBar from "@/components/LoadingBar.vue";
import PRename from "@/components/Instance/Console/File/Modal/PRename.vue";
import PDelete from "@/components/Instance/Console/File/Modal/PDelete.vue";
import PPermission from "@/components/Instance/Console/File/Modal/PPermission.vue";
import PUpload from "@/components/Instance/Console/File/Modal/PUpload.vue";
import PCreate from "@/components/Instance/Console/File/Modal/PCreate.vue";
import PFileEditor from "@/components/Instance/Console/File/PFileEditor.vue";
import AceModes from '@/config/ace.modes.json';
import {useInstanceDetail} from "@/stores/Instance/DetailStore";

type Row = {
    upper: boolean | null,
    base64: string | null,
    is_file: boolean | null,
    modified_at: number | null,
    size: number | null
}

const allItems = [
    {label: '新建', key: 'create', rules: {file: 1, folder: 1, multiple: 1, empty: 1}},
    {label: '压缩', key: 'compress', rules: {file: 1, folder: 1, multiple: 1}},
    {label: '解压', key: 'decompress', rules: {compressed: 1}},
    {label: '上传', key: 'upload', rules: {file: 1, folder: 1, multiple: 1, empty: 1}},
    {label: '下载', key: 'download', rules: {file: 1}},
    {label: '权限', key: 'permission', rules: {file: 1}},
    {label: '重命名', key: 'rename', rules: {file: 1, folder: 1}},
    {label: '删除', key: 'delete', rules: {file: 1, folder: 1, multiple: 1}}
];

const compressedSuffix = {
    'zip': 1
}

function itemFilter(type: 'file' | 'folder' | 'multiple' | 'empty') {
    let isCompressed = false;
    if (type == 'file' && selected.value.length === 1) {
        // 压缩文件判断
        isCompressed = Base64.decode(selected.value[0].base64!!).split('.').pop()!! in compressedSuffix;
    }
    return allItems.filter((item) => {
        return type in item.rules || (isCompressed ? 'compressed' in item.rules : false);
    });
}

const rowProps = (row: Row) => {
    return {
        style: 'cursor: pointer',
        onclick(e: { target: HTMLElement }) {
            if (e.target.tagName != 'TD') return;
            if (row.is_file) {
                const name = Base64.decode(row.base64!!);
                if (name.split('.').pop()!! in AceModes) {
                    clicked.value = name;
                    actions.modals.editor();
                }
            } else
                actions.enter(row?.upper ? '..' : Base64.decode(row.base64!!));
        },
        onContextmenu(e: MouseEvent) {
            if (row.upper) return;
            e.preventDefault();

            const type = checked.value.length ? 'multiple' :    // 多选
                row.is_file ? 'file' : 'folder';                // 单选

            selected.value = (type == 'multiple') ? data.value.filter((row: Row) => {
                return checked.value.indexOf(row.base64!!) !== -1;
            }) : [row];

            dropdown.value.status = false;
            dropdown.value.items = itemFilter(type);
            nextTick(() => {
                dropdown.value.status = true;
                dropdown.value.position.x = e.clientX;
                dropdown.value.position.y = e.clientY;
            });
        }
    };
}
const columns: DataTableColumns<Row> = [
    {
        type: 'selection', disabled(row: Row) {
            return row.upper == true;
        }
    },
    {
        title: '文件名', key: 'name', render(row) {
            return row.upper ? '返回上层...' : Base64.decode(row.base64!!);
        }
    },
    {
        title: '大小', key: 'size', render(row) {
            if (row.upper) return;
            return row.is_file ? ByteFormat(row.size!!) : '-';
        }
    },
    {
        title: '修改日期', key: 'modified_at', render(row) {
            if (row.upper) return;
            return h(NTime);
        }
    }
];

const detail = useInstanceDetail();
const message = useMessage();
const insId = useRoute().params.insId as unknown as number;
const path = ref('/');
const data = ref<Row[]>([]);
const checked = ref<DataTableRowKey[]>([]);
const selected = ref<Row[]>([]);
const clicked = ref<string>();
const table = ref(null);
const loading = ref(true);
const getKey = (row: Row) => row.upper ? '..' : row.base64;

onMounted(() => detail.listen(() => {
    actions.load('/');
}));

const actions = {
    load(target: string) {
        loading.value = true;
        ins.file.list(insId, Base64.encode(target)).then(res => {
            loading.value = false;
            checked.value = [];
            path.value = target;
            data.value = (target != '/' && res.data.data.length != 0) ? [{upper: true}, ...res.data.data] : res.data.data;
        });
    },
    reload() {
        actions.load(path.value);
    },
    enter(folder: string) {
        if (folder == '..')
            path.value = path.value.split('/').slice(0, -2).join('/');
        else
            path.value += folder;
        actions.load(path.value += '/');
    },
    modals: {
        rename: () => modals.value.rename = true,
        compress() {
            let targets: string[] = [];
            selected.value.forEach((item) => {
                targets.push(item.base64!!);
            });
            const wait = message.loading('压缩操作已开始，请耐心等待', {duration: 0});
            ins.file.compress(
                insId, Base64.encode(path.value), targets
            ).then(() => {
                actions.reload();
                if (wait) wait.destroy();
                message.success('压缩操作成功');
            });
        },
        delete: () => modals.value.delete = true,
        permission: () => modals.value.permission = true,
        upload: () => modals.value.upload = true,
        download() {
            ins.file.download(insId, Base64.encode(path.value + Base64.decode(selected.value[0].base64!!))).then(res => {
                window.location.href = res.data.attributes.url;
            });
        },
        decompress() {
            const wait = message.loading('解压缩操作已开始，请耐心等待', {duration: 0});
            ins.file.decompress(insId, Base64.encode(path.value + Base64.decode(selected.value[0].base64!!))).then(() => {
                actions.reload();
                if (wait) wait.destroy();
                message.success('解压缩操作成功');
            });
        },
        create: () => modals.value.create = true,
        editor: () => modals.value.editor = true
    }
};

const modals = ref({
    rename: false,
    delete: false,
    permission: false,
    upload: false,
    create: false,
    editor: false
});

const onCheck = (keys: DataTableRowKey[]) => {
    checked.value = keys;
};

const dropdown = ref<{
    status: boolean,
    position: { x: number, y: number },
    items: DropdownOption[],
    event: any
}>({
    status: false,
    position: {x: 0, y: 0},
    items: [],
    event: {
        onClickOutSide: () => dropdown.value.status = false,
        onSelect(option: 'create' | 'compress' | 'decompress' | 'upload' | 'download' | 'permission' | 'rename' | 'delete') {
            if (actions.modals[option])
                actions.modals[option]();
            dropdown.value.status = false;
        }
    }
});

const onEmptyMenu = () => {
    dropdown.value.items = itemFilter('empty');
}
</script>

<template>
    <div class="select-none">
        <n-loading-bar-provider :to="table" container-style="position: absolute; z-index: 1500;">
            <div ref="table" class="relative">
                <LoadingBar :loading="loading"/>
                <n-data-table :columns="columns" :data="data" :row-key="getKey" :checked-row-keys="checked"
                              @update:checked-row-keys="onCheck" :row-props="rowProps" class="table">
                    <template #empty>
                        <div class="text-center" v-if="!loading">
                            <div class="text-gray-600">此目录下不存在文件，您可以</div>
                            <div class="actions mt-1">
                                <n-dropdown trigger="click" :options="dropdown.items" class="min-w-[120px]"
                                            @select="dropdown.event.onSelect">
                                    <n-button type="primary" text-color="white" ghost size="small" @click="onEmptyMenu">打开菜单</n-button>
                                </n-dropdown>
                                <n-button type="primary" text-color="white" ghost @click="actions.enter('..')" size="small"
                                          v-if="path !== '/'">
                                    返回上层
                                </n-button>
                            </div>
                        </div>
                    </template>
                </n-data-table>
                <n-dropdown placement="bottom-start" trigger="manual" :x="dropdown.position.x" :y="dropdown.position.y"
                            :options="dropdown.items" :show="dropdown.status" class="min-w-[160px]"
                            :on-clickoutside="dropdown.event.onClickOutSide" @select="dropdown.event.onSelect"/>
            </div>
        </n-loading-bar-provider>

        <PRename :ins-id="insId" :path="path" :selected="selected" :reload="actions.reload"
                 v-model:show="modals.rename"/>
        <PDelete :ins-id="insId" :path="path" :selected="selected" :reload="actions.reload"
                 v-model:show="modals.delete"/>
        <PPermission :ins-id="insId" :path="path" :selected="selected" :reload="actions.reload"
                     v-model:show="modals.permission"/>
        <PUpload :ins-id="insId" :path="path" :reload="actions.reload" v-model:show="modals.upload"/>
        <PCreate :ins-id="insId" :path="path" :reload="actions.reload" v-model:show="modals.create"/>
        <PFileEditor :ins-id="insId" :path="path" :clicked="clicked" :reload="actions.reload"
                     v-model:show="modals.editor"/>
    </div>
</template>

<style scoped>
.table .actions > *:not(:first-child) {
    margin-left: .4rem !important;
}
</style>
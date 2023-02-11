<script lang="ts" setup>
import {DataTableColumns, NTag, NTime} from "naive-ui";
import {h} from "vue";
import PLink from "@/components/PLink.vue";

defineProps(['data']);

interface Row {
    id: number
    name: string
    version: string
    instances_count: number
    created_at: string
    updated_at: string
    app: {
        id: number
        name: string
    }
}

const columns: DataTableColumns<Row> = [{
    title: 'ID', key: 'id', render(row: Row) {
        return h(NTag, {}, () => row.id);
    }
}, {
    title: '名称', key: 'name'
}, {
    title: '版本', key: 'version'
}, {
    title: '镜像', key: 'app', render(row: Row) {
        return h(PLink, {to: {name: 'admin.app.index', params: {appId: row.app.id}}}, () => row.app.name);
    }
}, {
    title: '实例数量', key: 'instances_count'
}, {
    title: '创建时间', key: 'created_at', render(row: Row) {
        return h(NTime, {time: new Date(row.created_at)});
    }
}, {
    title: '操作', key: 'action', render(row: Row) {
        return h(PLink, {
            to: {name: 'admin.app.version', params: {versionId: row.id}},
            element: 'button',
            size: 'small'
        }, () => '修改');
    }
}];
</script>

<template>
    <n-data-table :columns="columns" :data="data" :bordered="true"/>
</template>
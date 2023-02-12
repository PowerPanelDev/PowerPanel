<script lang="ts" setup>
import {DataTableColumns, NTag, NTime} from "naive-ui";
import {h} from "vue";
import PLink from "@/components/PLink.vue";

defineProps(['data']);

interface Row {
    id: number
    name: string
    nodes_count: number
    instances_count: number
    created_at: string
    updated_at: string
}

const columns: DataTableColumns<Row> = [{
    title: 'ID', key: 'id', render(row: Row) {
        return h(NTag, {}, () => row.id);
    }
}, {
    title: '节点组名称', key: 'name'
}, {
    title: '节点数量', key: 'nodes_count'
}, {
    title: '实例数量', key: 'instances_count'
}, {
    title: '修改时间', key: 'updated_at', render(row: Row) {
        return h(NTime, {time: new Date(row.updated_at)});
    }
}, {
    title: '创建时间', key: 'created_at', render(row: Row) {
        return h(NTime, {time: new Date(row.created_at)});
    }
}, {
    title: '操作', key: 'action', render(row: Row) {
        return h(PLink, {
            to: {name: 'admin.node.group', params: {groupId: row.id}},
            element: 'button',
            size: 'small'
        }, () => '修改');
    }
}];
</script>

<template>
    <n-data-table :columns="columns" :data="data" :bordered="true"/>
</template>
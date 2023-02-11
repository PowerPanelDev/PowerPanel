<script lang="ts" setup>
import {DataTableColumns, NCheckbox, NTag, NTime} from "naive-ui";
import {h} from "vue";
import PLink from "@/components/PLink.vue";

defineProps(['data']);

interface Row {
    id: number
    name: string
    instances_count: number
    email: string
    is_admin: number
    created_at: string
    updated_at: string
}

const columns: DataTableColumns<Row> = [{
    title: 'ID', key: 'id', render(row: Row) {
        return h(NTag, {}, () => row.id);
    }
}, {
    title: '昵称', key: 'name'
}, {
    title: '实例数量', key: 'instances_count'
}, {
    title: '管理员', key: 'is_admin', render(row: Row) {
        return h(NCheckbox, {checked: row.is_admin == 1, readonly: true});
    }
}, {
    title: '邮箱', key: 'email'
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
            to: {name: 'admin.user.index', params: {userId: row.id}},
            element: 'button',
            size: 'small'
        }, () => '修改');
    }
}];
</script>

<template>
    <n-data-table :columns="columns" :data="data" :bordered="true"/>
</template>
<script lang="ts" setup>
import {DataTableColumns, NTag, NText, NTime} from "naive-ui";
import {h, ref} from "vue";
import {useAuthData} from "@/stores/AuthStore";
import {admin} from "@/class/Client";
import {ByteFormat} from "@/class/ByteFormat";
import PLink from "@/components/PLink.vue";

interface Row {
    id: number
    name: string
    group: {
        id: number
        name: string
    }
    instances_count: number
    memory: number
    instances_sum_memory: number
    memory_overallocate: number
    disk: number
    instances_sum_disk: number
    disk_overallocate: number
    updated_at: string
}

const columns: DataTableColumns<Row> = [{
    title: 'ID', key: 'id', render(row: Row) {
        return h(NTag, {}, () => row.id);
    }
}, {
    title: '节点名称', key: 'name'
}, {
    title: '平台', key: 'os'
}, {
    title: '节点组', key: 'group', render(row: Row) {
        return h(NText, {}, () => {
            return h(PLink, {to: {name: 'admin.node.group', params: {groupId: row.group.id}}}, () => row.group.name);
        });
    }
}, {
    title: '已分配内存 / 总量', key: 'memory', render(row: Row) {
        return h(NText, {}, () =>
            ByteFormat(row.instances_sum_memory * 1024 * 1024) + ' / '
            + ByteFormat(row.memory * (1 + row.memory_overallocate / 100) * 1024 * 1024) + ' ('
            + (row.instances_sum_memory / (row.memory * (1 + row.memory_overallocate / 100)) * 100).toFixed(1) + '%)'
        );
    }
}, {
    title: '已分配硬盘 / 总量', key: 'disk', render(row: Row) {
        return h(NText, {}, () =>
            ByteFormat(row.instances_sum_disk * 1024 * 1024) + ' / '
            + ByteFormat(row.disk * (1 + row.disk_overallocate / 100) * 1024 * 1024) + ' ('
            + (row.instances_sum_disk / (row.disk * (1 + row.disk_overallocate / 100)) * 100).toFixed(1) + '%)'
        );
    }
}, {
    title: '实例数量', key: 'instances_count'
}, {
    title: '修改时间', key: 'updated_at', render(row: Row) {
        return h(NTime, {time: new Date(row.updated_at)});
    }
}, {
    title: '操作', key: 'action', render(row: Row) {
        return h(PLink, {
            to: {name: 'admin.node.index', params: {nodeId: row.id}},
            element: 'button',
            size: 'small'
        }, () => '修改');
    }
}];
const data = ref<Row[]>([]);

useAuthData().listen(() => {
    admin.node.list((res) => {
        data.value = res.data.data;
    });
});
</script>

<template>
    <n-data-table class="table" :columns="columns" :data="data" :bordered="true"/>
</template>

<style scoped>
.table :deep(tr td:nth-child(3)) {
    text-transform: capitalize;
}
</style>
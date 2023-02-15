<script lang="ts" setup>
import {DataTableColumns, NTag, NText, NTime} from "naive-ui";
import {h, ref} from "vue";
import PLink from "@/components/PLink.vue";
import {InstanceStatus as S} from "@/class/Constant/Status";
import {useAuthData} from "@/stores/AuthStore";
import {admin} from "@/class/Client";

interface Row {
    id: number
    name: string
    relationship: {
        user: {
            id: number
            name: string
        }
    }
    node: {
        id: number
        name: string
    }
    stats: {
        status: number
    }
    app: {
        id: number,
        name: string
    }
    version: {
        id: number,
        name: string
    }
    created_at: string
}

const columns: DataTableColumns<Row> = [{
    title: 'ID', key: 'id', render(row: Row) {
        return h(NTag, {}, () => row.id);
    }
}, {
    title: '名称', key: 'name', render(row: Row) {
        return h(NText, {}, () => row.name || row.uuid.split('-')[0]);
    }
}, {
    title: '所有用户', key: 'user', render(row: Row) {
        return h(PLink, {
            to: {
                name: 'admin.user.index',
                params: {userId: row.relationship.user.id}
            }
        }, () => row.relationship.user.name);
    }
}, {
    title: '节点', key: 'node', render(row: Row) {
        return h(PLink, {to: {name: 'admin.node.index', params: {nodeId: row.node.id}}}, () => row.node.name);
    }
}, {
    title: '镜像', key: 'app', render(row: Row) {
        return h(PLink, {to: {name: 'admin.app.index', params: {appId: row.app.id}}}, () => row.app.name);
    }
}, {
    title: '版本', key: 'version', render(row: Row) {
        return h(PLink, {to: {name: 'admin.app.version', params: {versionId: row.version.id}}}, () => row.version.name);
    }
}, {
    title: '状态', key: 'status', render(row: Row) {
        return h(NTag, {type: row.stats.status == S.RUNNING ? 'success' : 'info'}, () => {
            return {
                [S.STARTING]: '启动中',
                [S.RUNNING]: '运行中',
                [S.STOPPING]: '关闭中',
                [S.STOPPED]: '已停止',
                [S.INSTALLING]: '安装中'
            }[row.stats.status];
        });
    }
}, {
    title: '创建时间', key: 'created_at', render(row: Row) {
        return h(NTime, {time: new Date(row.created_at)});
    }
}, {
    title: '操作', key: 'action', render(row: Row) {
        return h(PLink, {
            to: {name: 'admin.instance', params: {insId: row.id}},
            element: 'button',
            size: 'small',
            'text-color': 'white'
        }, () => '修改');
    }
}];
const data = ref<Row[]>();

useAuthData().listen(() => {
    admin.ins.list().then(res => {
        data.value = res.data.data;
    });
});
</script>

<template>
    <n-data-table :columns="columns" :data="data" :bordered="true"/>
</template>
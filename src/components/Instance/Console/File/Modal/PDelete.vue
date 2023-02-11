<script lang="ts" setup>
import {ins} from "@/class/Client";
import {Base64} from "@/class/Base64";
import {useMessage} from "naive-ui";
import {ref, watch} from "vue";

const props = defineProps(['insId', 'path', 'selected', 'reload', 'show']);
const emits = defineEmits(['update:show']);
const input = ref();
const message = useMessage();

watch(() => props.show, (v) => {
    if (!v) return;
    input.value = Base64.decode(props.selected[0].base64)
});

function onConfirm() {
    let targets: string[] = [];
    props.selected.forEach((item: { base64: string }) => {
        targets.push(item.base64);
    });
    ins.file.delete(props.insId, Base64.encode(props.path), targets).then(() => {
        message.success('删除操作成功');
        props.reload();
    });
    close();
}

function close() {
    emits('update:show', false);
}
</script>

<template>
    <n-modal preset="dialog" title="删除文件" positive-text="确定" negative-text="取消" @positive-click="onConfirm"
             :show-icon="false" :auto-focus="false" :show="show" @update:show="(v: boolean) => emits('update:show', v)">
        确定删除：
        <ul>
            <li v-for="item in selected.slice(0, 10)" :key="item.base64">{{ Base64.decode(item.base64) }}</li>
        </ul>
        <span v-if="selected.length > 10">等 {{ selected.length }} 个项</span>
    </n-modal>
</template>
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
    input.value = 'Loading...';
    ins.file.permission.get(props.insId, Base64.encode(props.path + Base64.decode(props.selected[0].base64))).then(res => {
        input.value = res.data.attributes.permission;
    });
});

function onConfirm() {
    ins.file.permission.set(
        props.insId,
        Base64.encode(props.path + Base64.decode(props.selected[0].base64)),
        input.value
    ).then(() => {
        if (props.reload) props.reload();
        message.success('更改权限操作成功');
    });
    close();
}

function close() {
    emits('update:show', false);
}
</script>

<template>
    <n-modal preset="dialog" title="更改权限" positive-text="确定" negative-text="取消" @positive-click="onConfirm"
             :show-icon="false" :auto-focus="false" :show="show" @update:show="(v: boolean) => emits('update:show', v)">
        <n-input v-model:value="input" type="text" placeholder="文件权限..." @keyup.enter="onConfirm"/>
    </n-modal>
</template>
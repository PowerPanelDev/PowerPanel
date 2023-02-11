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
    ins.file.rename(
        props.insId,
        Base64.encode(props.path + Base64.decode(props.selected[0].base64)),
        Base64.encode(props.path + input.value),
        () => {
            if (props.reload) props.reload();
            message.success('重命名操作成功');
        }
    );
    close();
}

function close() {
    emits('update:show', false);
}
</script>

<template>
    <n-modal preset="dialog" title="重命名" positive-text="确定" negative-text="取消" @positive-click="onConfirm"
             :show-icon="false" :auto-focus="false" :show="show" @update:show="(v: boolean) => emits('update:show', v)">
        <n-input v-model:value="input" type="text" placeholder="文件名..." @keyup.enter="onConfirm"/>
    </n-modal>
</template>
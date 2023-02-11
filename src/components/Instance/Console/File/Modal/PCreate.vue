<script lang="ts" setup>
import {ins} from "@/class/Client";
import {Base64} from "@/class/Base64";
import {useMessage} from "naive-ui";
import {ref, watch} from "vue";

const props = defineProps(['insId', 'path', 'selected', 'reload', 'show']);
const emits = defineEmits(['update:show']);
const name = ref();
const type = ref<'file' | 'folder'>('file');
const message = useMessage();

watch(() => props.show, (v: Boolean) => {
    if (!v) return;
    name.value = '';
});

function onConfirm() {
    ins.file.create(props.insId, Base64.encode(props.path), type.value, Base64.encode(name.value), () => {
        message.success('文件创建操作成功');
        props.reload();
        close();
    });
}

function close() {
    emits('update:show', false);
}
</script>

<template>
    <n-modal preset="dialog" title="新建文件" positive-text="确定" negative-text="取消" @positive-click="onConfirm"
             :show-icon="false" :auto-focus="false" :show="show" @update:show="(v: boolean) => emits('update:show', v)">
        <n-radio-group v-model:value="type">
            <n-radio value="file">文件</n-radio>
            <n-radio value="folder">文件夹</n-radio>
        </n-radio-group>
        <n-input v-model:value="name" type="text" placeholder="名称..." @keyup.enter="onConfirm" class="mt-[.6rem]"/>
    </n-modal>
</template>
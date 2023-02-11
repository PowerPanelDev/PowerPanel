<script lang="ts" setup>
import useClipboard from "vue-clipboard3";
import {computed} from "vue";
import {useMessage} from "naive-ui";
import {useInstanceDetail} from "@/stores/Instance/DetailStore";

const detail = useInstanceDetail();

const address = computed(() => 'IP: ' + detail.allocation.alias + ' · 端口: ' + detail.allocation.port);
const message = useMessage();

async function onClick() {
    const {toClipboard} = useClipboard();
    await toClipboard(address.value);
    message.success('服务器地址已复制到剪切板');
}
</script>

<template>
    <span @click="onClick">{{ address }}</span>
</template>
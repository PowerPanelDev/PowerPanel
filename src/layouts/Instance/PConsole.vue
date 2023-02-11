<script lang="ts" setup>
import {onUnmounted} from "vue";
import {useWebSocketStore} from "@/stores/Instance/WebSocketStore";
import PStatus from "@/components/Instance/Console/PStatus.vue";
import PTerminal from "@/components/Instance/Console/PTerminal.vue";
import {useInstanceDetail} from "@/stores/Instance/DetailStore";

const detail = useInstanceDetail();
const WebSocketStore = useWebSocketStore();

detail.listen(() => WebSocketStore.init());

onUnmounted(() => {
    WebSocketStore.close();
});
</script>

<template>
    <PStatus class="mdui-container mt-4"></PStatus>
    <PTerminal class="mdui-container mt-4"></PTerminal>
</template>

<style scoped>
.action :deep(.n-button) {
    margin-left: .6rem;
}
</style>
<script lang="ts" setup>
import {ByteFormat} from "@/class/ByteFormat";
import {onUnmounted, ref} from "vue";
import type {IWebSocketPacket} from '@/stores/Instance/WebSocketStore';
import {useWebSocketStore} from "@/stores/Instance/WebSocketStore";
import {InstanceStatus} from "@/class/Constant/Status";
import {useInstanceDetail} from "@/stores/Instance/DetailStore";

const detail = useInstanceDetail();
const status = ref<{
    cpu: number,
    memory: number,
    disk: number
}>({
    cpu: 0,
    memory: 0,
    disk: 0
});

const cancel = useWebSocketStore().listen((data: IWebSocketPacket) => {
    if (data.type == 'stats') {
        status.value = data.data;
    }
    if (data.type == 'status' && data.data == InstanceStatus.STOPPED) {
        status.value.cpu = 0;
        status.value.memory = 0;
    }
});

onUnmounted(() => cancel());
</script>

<template>
    <div class="grid md:grid-cols-3 gap-4">
        <div class="text-gray-800 p-4 pt-3 rounded-md border border-gray">
            <div class="stats-title font-thin">CPU 占用</div>
            <div class="stats-value font-medium text-xl text-gray-500 mt-[2px]">
                {{ status.cpu }}%
                <span class="text-lg"> / {{ (detail.cpu || 0) }}%</span></div>
        </div>
        <div class="text-gray-800 p-4 pt-3 rounded-md border border-gray">
            <div class="stats-title font-thin">内存占用</div>
            <div class="stats-value font-medium text-xl text-gray-500 mt-[2px]">
                {{ ByteFormat(status.memory) }}
                <span class="text-lg"> / {{ ByteFormat((detail.memory || 0) * 1024 * 1024, true) }}</span></div>
        </div>
        <div class="text-gray-800 p-4 pt-3 rounded-md border border-gray">
            <div class="stats-title font-thin">存储空间</div>
            <div class="stats-value font-medium text-xl text-gray-500 mt-[2px]">
                {{ ByteFormat(status.disk) }}
                <span class="text-lg"> / {{ ByteFormat((detail.disk || 0) * 1024 * 1024, true) }}</span></div>
        </div>
    </div>
</template>
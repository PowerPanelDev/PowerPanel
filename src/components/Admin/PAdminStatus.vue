<script setup lang="ts">
import {useDarkMode} from "@/stores/DarkModeStore";

const dark = useDarkMode();
</script>

<template>
    <div class="border rounded-md p-4 h-fit break-inside-avoid mb-4" v-if="$slots.label" :class="{ 'border-theme': dark.status }">
        <div :class="{ 'text-gray-600': !dark.status }">
            <slot name="label"></slot>
        </div>
        <div class="text-2xl font-semibold mt-[2px]" v-if="$slots.value" :class="{ 'text-gray-600': !dark.status }">
            <slot name="value"></slot>
        </div>
        <slot name="addition"></slot>
        <div class="text-right" v-if="$slots.action">
            <slot name="action"></slot>
        </div>
    </div>
</template>

<style scoped>
.border-theme {
    border-color: rgba(255, 255, 255, 0.09);
}
</style>
<template>
    <div class="border rounded-md p-4 h-fit break-inside-avoid mb-4" v-if="$slots.label">
        <div class="text-gray-600">
            <slot name="label"></slot>
        </div>
        <div class="text-2xl text-gray-600 font-semibold mt-[2px]" v-if="$slots.value">
            <slot name="value"></slot>
        </div>
        <slot name="addition"></slot>
        <div class="text-right" v-if="$slots.action">
            <slot name="action"></slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
defineProps(['breadcrumb']);
</script>

<template>
    <div class="mx-auto flex items-start" :class="{'mb-4': !$slots.tab}">
        <div>
            <div class="text-2xl font-thin md:text-3xl md:font-light">
                <slot name="title"></slot>
            </div>

            <n-breadcrumb class="mt-[.5rem] -ml-[4px]" v-if="breadcrumb">
                <n-breadcrumb-item v-for="item in breadcrumb" :key="item">{{ item }}</n-breadcrumb-item>
            </n-breadcrumb>

            <slot name="description"></slot>
        </div>
        <div class="grow"></div>
        <div>
            <slot name="action"></slot>
        </div>
    </div>
    <slot name="tab"></slot>
</template>
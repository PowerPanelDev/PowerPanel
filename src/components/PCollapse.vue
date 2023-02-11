<script lang="ts" setup>
import {ref} from "vue";

const props = defineProps(['show']);
const show = ref(props.show || false);
</script>

<template>
    <div @click="show = !show">
        <slot name="header"></slot>
    </div>
    <n-collapse-transition :show="show">
        <slot/>
    </n-collapse-transition>
</template>
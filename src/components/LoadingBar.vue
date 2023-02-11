<script lang="ts" setup>
import {useLoadingBar} from "naive-ui";
import {watch} from "vue";

const props = defineProps(['loading']);
const bar = useLoadingBar();

watch(() => props.loading, (v) => {
    if (v)
        bar.start();
    else
        bar.finish();
});
</script>

<template>
    <template></template>
</template>
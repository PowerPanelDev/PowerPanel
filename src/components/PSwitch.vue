<script lang="ts" setup>
import {computed} from "vue";

const props = defineProps(['modelValue', 'element']);
const emits = defineEmits(['update:modelValue']);

const model = computed({
    get() {
        return !!props.modelValue;
    },
    set(v) {
        emits('update:modelValue', v ? 1 : 0);
    }
});
</script>

<template>
    <n-switch v-model:value="model" v-if="element === 'switch'">
        <slot/>
    </n-switch>
    <n-checkbox v-model:checked="model" v-else>
        <slot/>
    </n-checkbox>
</template>
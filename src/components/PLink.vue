<script lang="ts" setup>
defineProps(['to', 'element']);
</script>

<template>
    <RouterLink :to="to" #="{ navigate, href }" custom>
        <n-button v-if="element === 'button'" @click="navigate" type="primary" v-bind="$attrs">
            <slot/>
        </n-button>
        <n-a v-else :href="href" @click="navigate" class="hover:underline">
            <slot/>
        </n-a>
    </RouterLink>
</template>
<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PInstanceList from "@/components/Admin/Instance/PInstanceList.vue";
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '实例管理']">
            <template #title>实例列表</template>
            <template #action>
                <n-button type="primary" text-color="white">新建实例</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <n-divider class="my-0"/>

    <div class="mdui-container mt-4">
        <PInstanceList/>
    </div>
</template>
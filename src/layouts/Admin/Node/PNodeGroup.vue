<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PNodeGroupList from "@/components/Admin/Node/PNodeGroupList.vue";
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '节点管理', '节点组管理']">
            <template #title>节点组列表</template>
            <template #action>
                <n-button type="primary">新建节点组</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <hr/>

    <div class="mdui-container mt-4">
        <PNodeGroupList/>
    </div>
</template>
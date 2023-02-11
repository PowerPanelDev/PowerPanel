<script lang="ts" setup>
import PageContainer from "@/components/PageContainer.vue";
import PageHeader from "@/components/PageHeader.vue";
import PNodeList from "@/components/Admin/Node/PNodeList.vue";
</script>

<template>
    <PageContainer>
        <PageHeader :breadcrumb="['管理面板', '节点管理']">
            <template #title>节点列表</template>
            <template #action>
                <n-button type="primary">新建节点</n-button>
            </template>
        </PageHeader>
    </PageContainer>

    <hr/>

    <div class="mdui-container mt-4">
        <PNodeList/>
    </div>
</template>
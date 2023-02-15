<script lang="ts" setup>
import PAddress from "@/components/Instance/Console/PAddress.vue";
import {ByteFormat} from "@/class/ByteFormat";
import {ref} from "vue";
import {ins} from "@/class/Client";
import {useMessage} from "naive-ui";
import {useInstanceDetail} from "@/stores/Instance/DetailStore";
import {EditRound} from "@vicons/material";

const detail = useInstanceDetail();
const name = ref<string>();
const namePopover = ref(false);
const message = useMessage();

detail.listen(() => name.value = detail.name ?? detail.uuid?.split('-')[0]);

const actions = {
    rename() {
        ins.rename(detail.id!, name.value!).then(() => {
            namePopover.value = false;
            message.success('实例名称更改成功');
            detail.name = name.value!;
        });
    }
}
</script>

<template>
    <div>
        <n-table col>
            <tbody>
            <tr>
                <td>实例 ID</td>
                <td>{{ detail.id }}</td>
            </tr>
            <tr>
                <td>实例名称</td>
                <td>
                    <n-popover trigger="manual" :show="namePopover">
                        <template #trigger>
                            <span @click="namePopover = !namePopover" class="flex items-center w-fit">
                                {{ detail.name || detail.uuid?.split('-')[0] }} <n-icon class="ml-1"><EditRound/></n-icon>
                            </span>
                        </template>
                        <n-input-group>
                            <n-input v-model:value="name" @keyup.enter="actions.rename()"/>
                            <n-button type="primary" text-color="white" @click="actions.rename()">
                                更改
                            </n-button>
                        </n-input-group>
                    </n-popover>
                </td>
            </tr>
            <tr>
                <td>实例地址</td>
                <td>
                    <PAddress/>
                </td>
            </tr>
            <tr>
                <td>CPU 限制</td>
                <td>{{ (detail.cpu || 0) }}%</td>
            </tr>
            <tr>
                <td>内存大小限制</td>
                <td>{{ ByteFormat((detail.memory || 0) * 1024 * 1024, true) }}</td>
            </tr>
            <tr>
                <td>储存空间限制</td>
                <td>{{ ByteFormat((detail.disk || 0) * 1024 * 1024, true) }}</td>
            </tr>
            </tbody>
        </n-table>
    </div>
</template>

<style scoped>
</style>
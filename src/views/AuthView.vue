<script lang="ts" setup>
import {ArrowForwardOutlined} from "@vicons/material";
import {ref} from "vue";
import AllowSubmit from "@/components/AllowSubmit.vue";

const input = ref({
    name: '',
    pass: ''
});
</script>

<template>
    <div class="background fixed inset-0 flex items-center">
        <div class="mdui-container flex content-end justify-end">
            <div class="login-container border p-6 pt-12 pb-16 rounded-lg w-full max-w-[360px] mx-auto md:mx-0">
                <div class="login-title">
                    <div class="text-xl text-gray-600 flex items-center">
                        <span>登录到</span>
                        <n-icon class="ml-[.4rem]" :size="24">
                            <ArrowForwardOutlined/>
                        </n-icon>
                    </div>
                    <div class="font-bold text-3xl text-gray-700 mt-1">PowerPanel</div>
                </div>
                <div class="login-form">
                    <n-form @submit.prevent>
                        <n-input v-model:value="input.name" placeholder="输入用户名" class="mt-10" size="large"/>
                        <n-input v-model:value="input.name" placeholder="输入密码" class="mt-4" size="large"/>

                        <n-button block type="primary" class="button" size="large">
                            登录
                            <n-icon class="ml-0.5" :size="16">
                                <ArrowForwardOutlined/>
                            </n-icon>
                        </n-button>

                        <AllowSubmit/>
                    </n-form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.background {
    background-color: #f1f2f6;
    background-image: linear-gradient(#f1f2f6 62px, transparent 0), linear-gradient(90deg, #636e72 2px, transparent 0);
    background-size: 64px 64px, 64px 64px;
    background-position: -2px -32px;
}

.login-container {
    background: rgba(255, 255, 255, .25);
    backdrop-filter: blur(2px);
}

.login-container .button {
    margin-top: 1.5rem;
}

.login-container :deep(.n-input) {
    background-color: #f5f6fa;
}
</style>
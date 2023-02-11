<script lang="ts" setup>
import {Terminal} from "xterm";
import {onMounted, onUnmounted, ref} from "vue";
import {FitAddon} from "xterm-addon-fit";
import config from '@/config/terminal.json'
import 'xterm/css/xterm.css';
import colors from "tailwindcss/colors";
import type {IWebSocketPacket} from '@/stores/Instance/WebSocketStore';
import {useWebSocketStore} from "@/stores/Instance/WebSocketStore";
import {Base64} from "@/class/Base64";
import {InstanceStatus as S} from "@/class/Constant/Status";

const terminal = new Terminal(config);
const fitAddon = new FitAddon();
const xterm = ref(null);
const command = ref('');
const tips = {
    [S.INSTALLING]: '实例正在安装，请耐心等待……',
    [S.STARTING]: '实例启动中，请稍候……',
    [S.RUNNING]: '实例已启动',
    [S.STOPPING]: '实例正在关机，请稍候……',
    [S.STOPPED]: '实例已关闭'
};
const WebSocketStore = useWebSocketStore();

onMounted(() => {
    terminal.loadAddon(fitAddon);
    terminal.open(xterm.value!!);
    terminal.onData((e) => {
        WebSocketStore.send({
            type: 'stdin',
            data: Base64.encode(e)
        });
    });
    fitAddon.fit();
});

window.addEventListener("resize", () => fitAddon.fit());

const cancel = WebSocketStore.listen((data: IWebSocketPacket) => {
    if (data.type in {'history': 1, 'stdout': 1}) {
        terminal.write(Base64.decode(data.data));
    } else if (data.type == 'status') {
        if (data.msg)
            terminal.writeln('\x1b[1;33m[PowerPanel] \x1b[0;30m' + data.msg);
        else
            terminal.writeln('\x1b[1;33m[PowerPanel] \x1b[0;30m' + (tips[data.data] ?? ''));
    }
});

onUnmounted(() => {
    terminal.dispose();
    cancel();
});

function onCommand() {
    WebSocketStore.send({
        type: 'stdin',
        data: Base64.encode(command.value + "\n")
    });
    command.value = '';
}
</script>

<template>
    <div>
        <div class="border rounded-md">
            <div class="px-[.8rem] pt-[.6rem]">
                <div ref="xterm" class="terminal"></div>
            </div>
            <div class="flex p-2">
                <div class="grow">
                    <n-input v-model:value="command" type="text" size="large" placeholder="输入命令..."
                             :color="colors.indigo[500]" @keyup.enter="onCommand"/>
                </div>
                <div class="ml-2">
                    <n-button type="primary" size="large" @click="onCommand">发送</n-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.terminal:deep(.xterm-viewport) {
    overflow-y: auto;
}

.terminal:deep(.xterm-viewport::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
}

.terminal:deep(.xterm-viewport::-webkit-scrollbar-track) {
    background: white;
}

.terminal:deep(.xterm-viewport::-webkit-scrollbar-thumb) {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.2);
}
</style>
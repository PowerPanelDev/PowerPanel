<script lang="ts" setup>
import {ins} from "@/class/Client";
import {Base64} from "@/class/Base64";
import {useMessage} from "naive-ui";
import {nextTick, onMounted, ref, watch} from "vue";
import modes from '@/config/ace.modes.json'
import useLoadScript from "@/class/useLoadScripts";
import {useDarkMode} from "@/stores/DarkModeStore";

const props = defineProps(['insId', 'path', 'clicked', 'reload', 'show']);
const emits = defineEmits(['update:show']);
const message = useMessage();
const editorRef = ref(null);
const aceBase = 'https://cdn.staticfile.org/ace/1.15.1';
const dark = useDarkMode();

let editor: any;

onMounted(() => {
    watch(() => props.show, async (v) => {
        if (!v) return;
        await useLoadScript([aceBase + '/ace.min.js']);
        await nextTick(() => {
            editor = (window as any).ace.edit(editorRef.value!!);
            (window as any).ace.config.set('basePath', aceBase);
            editor.setTheme('ace/theme/' + (dark.status ? 'one_dark' : 'chrome'));
            editor.setShowPrintMargin(false);
            editor.session.setMode('ace/mode/' + (modes as any)[props.clicked.split('.').pop()]);
            editor.commands.addCommand({
                name: 'save',
                bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
                exec: () => onConfirm(false)
            });
            ins.file.read(props.insId, Base64.encode(props.path + props.clicked)).then(res => {
                editor.setValue(Base64.decode(res.data.attributes.content), 0);
                editor.clearSelection();
            });
        });
    });
});

function onConfirm(_close = true) {
    ins.file.save(
        props.insId,
        Base64.encode(Base64.decode(props.path) + props.clicked),
        Base64.encode(editor.getValue())
    ).then(() => {
        message.success('保存成功');
        if (_close) close();
    });
}

function onResize() {
    editor.resize();
}

function close() {
    emits('update:show', false);
}

const width: number = window.innerWidth;
</script>

<template>
    <n-drawer :default-width="Math.min(768, width)" resizable placement="right" class="drawer" :show="props.show"
              :mask-closable="false" @update:show="(v: boolean) => emits('update:show', v)" @update:width="onResize">
        <n-drawer-content closable body-content-style="padding: 0">
            <template #header>
                编辑文件
            </template>
            <div ref="editorRef" class="editor" @keyup.ctrl.enter="() => onConfirm"></div>
            <template #footer>
                <n-button type="primary" text-color="white" @click="onConfirm">保存</n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<style scoped>
.editor {
    height: 100%;
}
</style>
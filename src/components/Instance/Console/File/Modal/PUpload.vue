<script lang="ts" setup>
import {ins} from "@/class/Client";
import {Base64} from "@/class/Base64";
import {ref} from "vue";
import type {UploadFileInfo} from "naive-ui";
import {useMessage} from "naive-ui";
import type {AxiosProgressEvent} from "axios";
import axios from "axios";

const props = defineProps(['insId', 'path', 'reload', 'show']);
const emits = defineEmits(['update:show']);
const message = useMessage();
const files = ref<UploadFileInfo[]>([]);

function onChange(options: { fileList: UploadFileInfo[] }) {
    files.value = options.fileList;
}

function submit() {
    let size = 0,
        count = 0;
    const formData = new FormData();

    files.value.forEach((file: UploadFileInfo) => {
        formData.append(file.file?.name!!, file.file!!, file.file?.name);
        size += file.file?.size!!;
        count++;
    });

    ins.file.upload(props.insId, Base64.encode(props.path), async (res) => {
        const sliceSize: number = res.data.attributes.max_slice_size;
        if (size > sliceSize) {
            // 切片上传
            let uploadedSize = 0,
                uploadedCount = 0;

            message.info('总大小较大，将采用分块方式上传');
            const wait = message.loading('文件上传中：0%，已完成：0/' + count + ' 个文件', {duration: 0});
            close();

            for (let i in files.value) {
                const file = files.value[i];
                let current = 0;

                while (current < file.file?.size!!) {
                    const chunk = new FormData,
                        slice = file.file?.slice(current, current + sliceSize);
                    chunk.append(file.file?.name!!, slice!!, file.file?.name);
                    await axios.post(res.data.attributes.url + '&slice=1&first=' + (current ? 0 : 1), chunk);

                    current += sliceSize;
                    uploadedSize += slice!!.size;

                    wait.content = '文件上传中：' + Math.floor(uploadedSize / size * 100) + '%，已上传：' + uploadedCount + '/' + count + ' 个文件';
                }

                uploadedCount++;
            }

            wait.destroy();
            message.success('文件上传完成');
            props.reload();
        } else {
            const wait = message.loading('文件上传中：0%', {duration: 0});
            axios.post(res.data.attributes.url, formData, {
                onUploadProgress(e: AxiosProgressEvent) {
                    wait.content = '文件上传中：' + Math.floor(e.progress!! * 100) + '%';
                }
            }).then(() => {
                message.success('上传完成');
                props.reload();
            }).catch((res) => {
                const data = res.response.data;
                message.error(data.code + ' 错误：' + data.msg);
            }).finally(() => {
                wait.destroy();
            });
            close();
        }
    });
}

function close() {
    emits('update:show', false);
}
</script>

<template>
    <n-modal preset="dialog" title="文件上传" positive-text="完成" @positive-click="submit" :show-icon="false"
             :auto-focus="false" :show="show" @update:show="(v: boolean) => emits('update:show', v)">
        <n-upload multiple directory-dnd :default-upload="false" @change="onChange">
            <n-upload-dragger>
                点击或者拖动文件到该区域以上传
            </n-upload-dragger>
        </n-upload>
    </n-modal>
</template>
import {defineStore} from 'pinia'

interface IDetail {
    loaded: boolean,
    cpu: number | null,
    disk: number | null,
    id: number | null,
    memory: number | null,
    name: string | null,
    uuid: string | null,
    allocation: {
        alias: string | null,
        port: number | null
    }
    status: number | null
}

export const useInstanceDetail = defineStore('InstanceDetail', {
    state: (): IDetail => ({
        loaded: false,
        id: null,
        uuid: null,
        name: null,
        cpu: null,
        memory: null,
        disk: null,
        allocation: {
            alias: null,
            port: null
        },
        status: null
    }),
    actions: {
        listen(callback: () => void) {
            if (this.loaded) return callback();
            const cancel = this.$subscribe(() => {
                callback();
                cancel();
            });
        },
        init(attributes: Object) {
            this.$patch({loaded: true, ...attributes});
        }
    }
})
import {defineStore} from 'pinia'
import {auth} from "@/class/Client";

export const useAuthData = defineStore('AuthStore', {
    state: () => ({
        loaded: false,
        status: false,
        uid: 0,
        csrf: '',
        is_admin: false
    }),
    actions: {
        listen(callback: () => void) {
            if (this.loaded) return callback();
            const cancel = this.$subscribe(() => {
                callback();
                cancel();
            });
        },
        load(callback: () => void) {
            auth.fetch((res) => {
                this.$patch({loaded: true, status: res.data.status, ...res.data.attributes});
                callback();
            });
        }
    }
})
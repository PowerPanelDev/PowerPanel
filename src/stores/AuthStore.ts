import {defineStore} from 'pinia'

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
    }
})
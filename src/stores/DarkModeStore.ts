import {defineStore} from 'pinia'
import {useOsTheme} from "naive-ui";

export const useDarkMode = defineStore('DarkMode', {
    state: () => ({
        status: useOsTheme().value == 'dark'
    }),
    actions: {
        toggle() {
            this.status = !this.status;
        }
    }
})

import {useAuthData} from '@/stores/AuthStore';
import axios from 'axios';

function Get(url: string, params: {}, onSuccess: (res: any) => void) {
    const AuthStore = useAuthData();
    axios.get(url, {params: {...params, ...(AuthStore.csrf ? {csrf: AuthStore.csrf} : {})}}).then(onSuccess).catch((res) => {
        console.log(res);
        const data = res.response.data;
        (window as any).message.error(data.code + ' 错误：' + data.msg);
    });
}

function Post(url: string, params: {}, onSuccess: (res: any) => void) {
    const AuthStore = useAuthData();
    axios.post(url, {...params, ...(AuthStore.csrf ? {csrf: AuthStore.csrf} : {})}).then(onSuccess).catch((res) => {
        const data = res.response.data;
        (window as any).message.error(data.code + ' 错误：' + data.msg);
    });
}

function Put(url: string, params: {}, onSuccess: (res: any) => void) {
    const AuthStore = useAuthData();
    axios.put(url, {...params, ...(AuthStore.csrf ? {csrf: AuthStore.csrf} : {})}).then(onSuccess).catch(function (res) {
        const data = res.response.data;
        (window as any).message.error(data.code + ' 错误：' + data.msg);
    });
}

function Delete(url: string, params: {}, onSuccess: (res: any) => void) {
    const AuthStore = useAuthData();
    axios.delete(url, {params: {...params, ...(AuthStore.csrf ? {csrf: AuthStore.csrf} : {})}}).then(onSuccess).catch(function (res) {
        const data = res.response.data;
        (window as any).message.error(data.code + ' 错误：' + data.msg);
    });
}

const auth = {
    fetch(onSuccess: (res: any) => void) {
        Get('/api/public/auth', {}, onSuccess);
    },
    login(name: string, password: string, onSuccess: (res: any) => void) {
        Post('/api/public/auth/login', {name, password}, onSuccess);
    }
}

const ins = {
    list(onSuccess: (res: any) => void) {
        Get('/api/public/ins', {}, onSuccess);
    },
    fetch(insId: number, onSuccess: (res: any) => void) {
        Get('/api/public/ins/' + insId, {}, onSuccess);
    },
    getConsole(insId: number, onSuccess: (res: any) => void) {
        Get('/api/public/ins/' + insId + '/console', {}, onSuccess);
    },
    rename(insId: number, name: string, onSuccess: (res: any) => void) {
        Put('/api/public/ins/' + insId + '/rename', {name}, onSuccess);
    },
    file: {
        list(insId: number, path: string, onSuccess: (res: any) => void) {
            Get('/api/public/ins/' + insId + '/files', {path}, onSuccess);
        },
        rename(insId: number, from: string, to: string, onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/rename', {from, to}, onSuccess);
        },
        compress(insId: number, base: string, targets: string[], onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/compress', {base, targets}, onSuccess);
        },
        delete(insId: number, base: string, targets: string[], onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/delete', {base, targets}, onSuccess);
        },
        permission: {
            get(insId: number, path: string, onSuccess: (res: any) => void) {
                Post('/api/public/ins/' + insId + '/files/permission', {path}, onSuccess);
            },
            set(insId: number, path: string, permission: number, onSuccess: (res: any) => void) {
                Put('/api/public/ins/' + insId + '/files/permission', {path, permission}, onSuccess);
            }
        },
        download(insId: number, path: string, onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/download', {path}, onSuccess);
        },
        upload(insId: number, base: string, onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/upload', {base}, onSuccess);
        },
        decompress(insId: number, path: string, onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/decompress', {path}, onSuccess);
        },
        create(insId: number, base: string, type: 'file' | 'folder', name: string, onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/create', {base, type, name}, onSuccess);
        },
        read(insId: number, path: string, onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/read', {path}, onSuccess);
        },
        save(insId: number, path: string, content: string, onSuccess: (res: any) => void) {
            Post('/api/public/ins/' + insId + '/files/save', {path, content}, onSuccess);
        }
    }
}

const admin = {
    fetch(onSuccess: (res: any) => void) {
        Get('/api/admin', {}, onSuccess);
    },
    ins: {
        list(onSuccess: (res: any) => void) {
            Get('/api/admin/ins', {}, onSuccess);
        }
    },
    node: {
        group: {
            list(onSuccess: (res: any) => void) {
                Get('/api/admin/node/group', {}, onSuccess);
            }
        },
        list(onSuccess: (res: any) => void) {
            Get('/api/admin/node', {}, onSuccess);
        }
    },
    user: {
        list(onSuccess: (res: any) => void) {
            Get('/api/admin/user', {}, onSuccess);
        },
        create(data: any, onSuccess: (res: any) => void) {
            Post('/api/admin/user', data, onSuccess);
        },
        detail(id: number, onSuccess: (res: any) => void) {
            Get('/api/admin/user/' + id, {}, onSuccess);
        },
        update(id: number, data: any, onSuccess: (res: any) => void) {
            Put('/api/admin/user/' + id, data, onSuccess);
        },
        delete(id: number, onSuccess: (res: any) => void) {
            Delete('/api/admin/user/' + id, {}, onSuccess);
        }
    },
    app: {
        game: {
            list(onSuccess: (res: any) => void) {
                Get('/api/admin/app/game', {}, onSuccess);
            },
            create(data: any, onSuccess: (res: any) => void) {
                Post('/api/admin/app/game', data, onSuccess);
            },
            detail(id: number, onSuccess: (res: any) => void) {
                Get('/api/admin/app/game/' + id, {}, onSuccess);
            },
            update(id: number, data: any, onSuccess: (res: any) => void) {
                Put('/api/admin/app/game/' + id, data, onSuccess);
            },
            delete(id: number, onSuccess: (res: any) => void) {
                Delete('/api/admin/app/game/' + id, {}, onSuccess);
            }
        },
        version: {
            list(onSuccess: (res: any) => void) {
                Get('/api/admin/app/version', {}, onSuccess);
            },
            create(data: any, onSuccess: (res: any) => void) {
                Post('/api/admin/app/version', data, onSuccess);
            },
            detail(id: number, onSuccess: (res: any) => void) {
                Get('/api/admin/app/version/' + id, {}, onSuccess);
            },
            update(id: number, data: any, onSuccess: (res: any) => void) {
                Put('/api/admin/app/version/' + id, data, onSuccess);
            },
            delete(id: number, onSuccess: (res: any) => void) {
                Delete('/api/admin/app/version/' + id, {}, onSuccess);
            }
        },
        list(onSuccess: (res: any) => void) {
            Get('/api/admin/app', {}, onSuccess);
        },
        create(data: any, onSuccess: (res: any) => void) {
            Post('/api/admin/app', data, onSuccess);
        },
        detail(id: number, onSuccess: (res: any) => void) {
            Get('/api/admin/app/' + id, {}, onSuccess);
        },
        update(id: number, data: any, onSuccess: (res: any) => void) {
            Put('/api/admin/app/' + id, data, onSuccess);
        },
        delete(id: number, onSuccess: (res: any) => void) {
            Delete('/api/admin/app/' + id, {}, onSuccess);
        }
    }
}

export {auth, ins, admin}
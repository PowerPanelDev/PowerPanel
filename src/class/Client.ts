import {useAuthData} from '@/stores/AuthStore';
import axios from 'axios';
import AppConfig from "../../app.config";

function Get(url: string, params: {}) {
    const AuthStore = useAuthData();
    return axios.get(AppConfig.api.endpoint + url, {
        params: {
            ...params,
            ...(AuthStore.csrf ? {csrf: AuthStore.csrf} : {})
        },
        withCredentials: true
    }).then(res => res).catch(reason => {
        const data = reason.response.data;
        (window as any).message.error(data.code + ' 错误：' + data.msg);
        throw reason;
    });
}

function Post(url: string, params: {}) {
    const AuthStore = useAuthData();
    return axios.post(AppConfig.api.endpoint + url, {
        ...params,
        ...(AuthStore.csrf ? {csrf: AuthStore.csrf} : {})
    }, {
        withCredentials: true
    }).catch(reason => {
        const data = reason.response.data;
        (window as any).message.error(data.code + ' 错误：' + data.msg);
        throw reason;
    });
}

function Put(url: string, params: {}) {
    const AuthStore = useAuthData();
    return axios.put(AppConfig.api.endpoint + url, {
        ...params,
        ...(AuthStore.csrf ? {csrf: AuthStore.csrf} : {})
    }, {
        withCredentials: true
    }).catch(reason => {
        const data = reason.response.data;
        (window as any).message.error(data.code + ' 错误：' + data.msg);
        throw reason;
    });
}

function Delete(url: string, params: {}) {
    const AuthStore = useAuthData();
    return axios.delete(AppConfig.api.endpoint + url, {
        params: {
            ...params,
            ...(AuthStore.csrf ? {csrf: AuthStore.csrf} : {})
        },
        withCredentials: true
    }).catch(reason => {
        const data = reason.response.data;
        (window as any).message.error(data.code + ' 错误：' + data.msg);
        throw reason;
    });
}

const auth = {
    fetch() {
        return Get('/api/public/auth', {});
    },
    login(name: string, password: string) {
        return Post('/api/public/auth/login', {name, password});
    },
    logout() {
        return Get('/api/public/auth/logout', {});
    }
}

const ins = {
    list() {
        return Get('/api/public/ins', {});
    },
    fetch(insId: number) {
        return Get('/api/public/ins/' + insId, {});
    },
    getConsole(insId: number) {
        return Get('/api/public/ins/' + insId + '/console', {});
    },
    rename(insId: number, name: string) {
        return Put('/api/public/ins/' + insId + '/rename', {name});
    },
    file: {
        list(insId: number, path: string) {
            return Get('/api/public/ins/' + insId + '/files', {path});
        },
        rename(insId: number, from: string, to: string) {
            return Post('/api/public/ins/' + insId + '/files/rename', {from, to});
        },
        compress(insId: number, base: string, targets: string[]) {
            return Post('/api/public/ins/' + insId + '/files/compress', {base, targets});
        },
        delete(insId: number, base: string, targets: string[]) {
            return Post('/api/public/ins/' + insId + '/files/delete', {base, targets});
        },
        permission: {
            get(insId: number, path: string) {
                return Post('/api/public/ins/' + insId + '/files/permission', {path});
            },
            set(insId: number, path: string, permission: number) {
                return Put('/api/public/ins/' + insId + '/files/permission', {path, permission});
            }
        },
        download(insId: number, path: string) {
            return Post('/api/public/ins/' + insId + '/files/download', {path});
        },
        upload(insId: number, base: string) {
            return Post('/api/public/ins/' + insId + '/files/upload', {base});
        },
        decompress(insId: number, path: string) {
            return Post('/api/public/ins/' + insId + '/files/decompress', {path});
        },
        create(insId: number, base: string, type: 'file' | 'folder', name: string) {
            return Post('/api/public/ins/' + insId + '/files/create', {base, type, name});
        },
        read(insId: number, path: string) {
            return Post('/api/public/ins/' + insId + '/files/read', {path});
        },
        save(insId: number, path: string, content: string) {
            return Post('/api/public/ins/' + insId + '/files/save', {path, content});
        }
    }
}

const admin = {
    fetch() {
        return Get('/api/admin', {});
    },
    ins: {
        list() {
            return Get('/api/admin/ins', {});
        }
    },
    node: {
        group: {
            list() {
                return Get('/api/admin/node/group', {});
            },
            create(data: any) {
                return Post('/api/admin/node/group', data);
            },
            detail(id: number) {
                return Get('/api/admin/node/group/' + id, {});
            },
            update(id: number, data: any) {
                return Put('/api/admin/node/group/' + id, data);
            },
            delete(id: number) {
                return Delete('/api/admin/node/group/' + id, {});
            }
        },
        list() {
            return Get('/api/admin/node', {});
        },
        create(data: any) {
            return Post('/api/admin/node', data);
        },
        detail(id: number) {
            return Get('/api/admin/node/' + id, {});
        },
        update(id: number, data: any) {
            return Put('/api/admin/node/' + id, data);
        },
        delete(id: number) {
            return Delete('/api/admin/node/' + id, {});
        }
    },
    user: {
        list() {
            return Get('/api/admin/user', {});
        },
        create(data: any) {
            return Post('/api/admin/user', data);
        },
        detail(id: number) {
            return Get('/api/admin/user/' + id, {});
        },
        update(id: number, data: any) {
            return Put('/api/admin/user/' + id, data);
        },
        delete(id: number) {
            return Delete('/api/admin/user/' + id, {});
        }
    },
    app: {
        game: {
            list() {
                return Get('/api/admin/app/game', {});
            },
            create(data: any) {
                return Post('/api/admin/app/game', data);
            },
            detail(id: number) {
                return Get('/api/admin/app/game/' + id, {});
            },
            update(id: number, data: any) {
                return Put('/api/admin/app/game/' + id, data);
            },
            delete(id: number) {
                return Delete('/api/admin/app/game/' + id, {});
            }
        },
        version: {
            list() {
                return Get('/api/admin/app/version', {});
            },
            create(data: any) {
                return Post('/api/admin/app/version', data);
            },
            detail(id: number) {
                return Get('/api/admin/app/version/' + id, {});
            },
            update(id: number, data: any) {
                return Put('/api/admin/app/version/' + id, data);
            },
            delete(id: number) {
                return Delete('/api/admin/app/version/' + id, {});
            }
        },
        list() {
            return Get('/api/admin/app', {});
        },
        create(data: any) {
            return Post('/api/admin/app', data);
        },
        detail(id: number) {
            return Get('/api/admin/app/' + id, {});
        },
        update(id: number, data: any) {
            return Put('/api/admin/app/' + id, data);
        },
        delete(id: number) {
            return Delete('/api/admin/app/' + id, {});
        }
    }
}

export {auth, ins, admin}
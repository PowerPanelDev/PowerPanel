import {createRouter, createWebHistory} from 'vue-router'
import AuthViewVue from '@/views/AuthView.vue'
import IndexViewVue from '@/views/IndexView.vue'
import InstanceView from "@/views/InstanceView.vue";
import BasicLayout from "@/layouts/BasicLayout.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        name: 'index',
        component: BasicLayout,
        children: [{
            path: '/',
            name: 'instance',
            component: IndexViewVue
        }, {
            path: '/ins/:insId',
            component: InstanceView,
            children: [{
                path: '',
                name: 'instance.detail',
                alias: ['detail'],
                component: () => import('@/layouts/Instance/PDetail.vue')
            }, {
                path: 'console',
                name: 'instance.console',
                component: () => import('@/layouts/Instance/PConsole.vue')
            }, {
                path: 'file',
                name: 'instance.file',
                component: () => import('@/layouts/Instance/PFile.vue')
            }]
        }, {
            path: '/admin',
            component: () => import('@/views/AdminView.vue'),
            children: [{
                path: '',
                name: 'admin.index',
                component: () => import('@/layouts/Admin/PAdmin.vue')
            }, {
                path: 'ins',
                children: [{
                    path: ':insId?',
                    name: 'admin.instance',
                    component: () => import('@/layouts/Admin/Instance/PInstanceIndex.vue')
                }]
            }, {
                path: 'user/:userId?',
                name: 'admin.user.index',
                component: () => import('@/layouts/Admin/User/PUserIndex.vue')
            }, ...[
                // 此处为了直观使用了展开语法
                {
                    path: 'node/group/:groupId?',
                    name: 'admin.node.group',
                    component: () => import('@/layouts/Admin/Node/PNodeGroup.vue')
                }, {
                    path: 'node/:nodeId?',
                    name: 'admin.node.index',
                    component: () => import('@/layouts/Admin/Node/PNodeIndex.vue')
                }
            ], ...[
                {
                    path: 'app/:appId?',
                    name: 'admin.app.index',
                    component: () => import('@/layouts/Admin/App/PAppIndex.vue')
                }, {
                    path: 'app/game/:gameId?',
                    name: 'admin.app.game',
                    component: () => import('@/layouts/Admin/App/PAppGame.vue')
                }, {
                    path: 'app/version/:versionId?',
                    name: 'admin.app.version',
                    component: () => import('@/layouts/Admin/App/PAppVersion.vue')
                }
            ]]
        }]
    }, {
        path: '/auth',
        name: 'auth',
        component: AuthViewVue
    }, {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }]
})

export default router

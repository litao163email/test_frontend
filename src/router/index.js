import {
    createRouter, createWebHashHistory
} from 'vue-router'

import store from '../store/index.js'

const routes = [{
    path: '/',
    name: 'home',
    component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue'),
    redirect: "/project",
    children: [
        {
            path: '/project', name: 'project', component: () => import('../views/Project.vue'), meta: {
                name: "项目首页"
            }
        },
        {
            path: '/testscent', name: 'testscent', component: () => import('../views/TestScent.vue'), meta: {
                name: "测试场景"
            }
        }, {
            path: '/interface', name: 'interface', component: () => import('../views/Interface.vue'), meta: {
                name: "接口管理"
            }
        }, {
            path: '/teststep', name: 'teststep', component: () => import('../views/TestStep.vue'), meta: {
                name: "接口测试"
            }
        }, {
            path: '/testplan', name: 'testplan', component: () => import('../views/TestPlan.vue'), meta: {
                name: "测试计划"
            }
        },

        {
            path: '/testenv', name: 'testenv', component: () => import('../views/TestEnv.vue'), meta: {
                name: "测试环境"
            }
        }, {
            path: '/crontab', name: 'crontab', component: () => import('../views/CronTab.vue'), meta: {
                name: "定时任务"
            }
        },

        {
            path: '/report/:id', name: 'report', component: () => import('../views/Report.vue'), meta: {
                name: "测试报告"
            }
        }, {
            path: '/bugs', name: 'bug', component: () => import('../views/BugManage.vue'), meta: {
                name: "bug管理"
            }
        }, {
            path: '/records', name: 'records', component: () => import('../views/Records.vue'), meta: {
                name: "测试报表"
            }
        },]
}, {
    path: '/login', name: 'login', component: () => import( /* webpackChunkName: "about" */ '../views/Login.vue'),

}, {
    path: '/allProject',
    name: 'allProject',
    component: () => import( /* webpackChunkName: "about" */ '../views/AllProject.vue')
}]

const router = createRouter({
    history: createWebHashHistory(), routes
})

// 设置路由导航守卫
router.beforeEach((to, from, next) => {
    // 添加到路由到标签列表中
    if (to.meta.name) {
        // 添加标签
        store.commit('addTags', {
            name: to.meta.name, path: to.path
        })
    }

    // 获取登录之后的token值
    const isAuthenticated = window.sessionStorage.getItem('token')
    // 判断是否登录
    if (to.name !== 'login' && !isAuthenticated) {
        next({
            name: 'login'
        })
    } else {
        next()
    }
})


export default router

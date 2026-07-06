import { createRouter, createWebHistory } from 'vue-router'

// 定义路由规则
const routes = [
    {
        path: '/',
        name: 'TodayPlan',
        component: () => import('../views/TodayPlan.vue'),
    },
    {
        path: '/focus/:taskId',
        name: 'FocusTimer',
        component: () => import('../views/FocusTimer.vue'),
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

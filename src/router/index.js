import { createRouter, createWebHistory } from 'vue-router'

// 定义路由规则
const routes = [
    {
        path: '/',
        name: 'TodayPlan',
        component: () => import('../views/TodayPlan.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

import { reactive, watch } from 'vue'

// ==================== localStorage 工具函数 ====================
function load(key, defaultValue) {
    try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : defaultValue
    } catch {
        return defaultValue
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

// ==================== 初始化默认用户数据 ====================
function initDefaultData() {
    // 首次使用时创建默认用户名
    if (!localStorage.getItem('settings')) {
        save('settings', { username: '同学' })
    }
    if (!localStorage.getItem('tasks')) {
        save('tasks', [])
    }
    if (!localStorage.getItem('logs')) {
        save('logs', [])
    }
}
initDefaultData()

// ==================== 全局响应式状态 ====================
const store = reactive({
    /*
      settings: { username }
    */
    settings: load('settings', { username: '同学' }),

    /*
      tasks: [
        {
          id: string,            // 唯一标识
          title: string,         // 任务标题
          duration: number,      // 该任务专注时长（分钟）
          createdAt: timestamp,  // 创建时间
          completedAt: timestamp | null, // 完成时间
          status: 'pending' | 'completed'
        }
      ]
    */
    tasks: load('tasks', []),

    /*
      logs: [
        {
          id: string,
          taskId: string,
          startTime: timestamp,
          endTime: timestamp,
          duration: number  // 本次专注时长（分钟）
        }
      ]
    */
    logs: load('logs', []),
})

// ==================== 自动持久化 ====================
watch(() => store.settings, (val) => save('settings', val), { deep: true })
watch(() => store.tasks, (val) => save('tasks', val), { deep: true })
watch(() => store.logs, (val) => save('logs', val), { deep: true })

// ==================== 工具：生成 ID ====================
function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ==================== 任务 CRUD ====================

/** 添加任务 */
function addTask(title, duration) {
    store.tasks.unshift({
        id: genId(),
        title,
        duration: duration || 25,
        createdAt: Date.now(),
        completedAt: null,
        status: 'pending',
    })
}

/** 删除任务 */
function deleteTask(taskId) {
    const idx = store.tasks.findIndex((t) => t.id === taskId)
    if (idx !== -1) store.tasks.splice(idx, 1)
}

/** 更新任务（编辑标题、预估番茄数等） */
function updateTask(taskId, data) {
    const task = store.tasks.find((t) => t.id === taskId)
    if (task) Object.assign(task, data)
}

// ==================== 番茄钟 / 计时 ====================
/** 完成一个番茄钟，标记任务为已完成 */
function completePomodoro(taskId, duration) {
    const task = store.tasks.find((t) => t.id === taskId)
    if (!task) return

    const actualDuration = duration || task.duration || 25

    store.logs.push({
        id: genId(),
        taskId,
        startTime: Date.now() - actualDuration * 60 * 1000,
        endTime: Date.now(),
        duration: actualDuration,
    })

    task.status = 'completed'
    task.completedAt = Date.now()
}

// ==================== 查询辅助 ====================

/** 获取今日创建的任务 */
function getTodayTasks() {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    return store.tasks.filter((t) => t.createdAt >= todayStart.getTime())
}

/** 获取任务的总专注时长（分钟） */
function getTaskTotalDuration(taskId) {
    return store.logs
        .filter((l) => l.taskId === taskId)
        .reduce((sum, l) => sum + l.duration, 0)
}

/** 获取连续完成的番茄数（用于鼓励文案） */
function getConsecutivePomodoros() {
    let count = 0
    // 从最近一条日志往前数连续的同一天记录
    for (let i = store.logs.length - 1; i >= 0; i--) {
        count++
        if (i > 0) {
            const curr = new Date(store.logs[i].endTime)
            const prev = new Date(store.logs[i - 1].endTime)
            // 间隔超过 1 小时认为不是连续的
            if (curr - prev > 60 * 60 * 1000) break
        }
    }
    return count
}

export {
    store,
    addTask,
    deleteTask,
    updateTask,
    completePomodoro,
    getTodayTasks,
    getTaskTotalDuration,
    getConsecutivePomodoros,
}
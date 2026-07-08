import { reactive, watch } from 'vue'


function load(key, defaultValue) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}


function initDefaultData() {
    if (!localStorage.getItem('settings')) {
        save('settings', { username: '同学' })
    }
    if (!localStorage.getItem('tasks')) {
        save('tasks', [])
    }
}
initDefaultData()

const store = reactive({

    settings: load('settings', { username: '同学' }),


    tasks: load('tasks', []),
})


watch(() => store.settings, (val) => save('settings', val), { deep: true })
watch(() => store.tasks, (val) => save('tasks', val), { deep: true })

// ==================== 工具：生成 ID ====================
function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}


/** 添加任务 */
function addTask(title, duration) {
    store.tasks.unshift({
        id: genId(),
        title,
        duration: duration || 25,
        createdAt: Date.now(),
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

/** 完成一个番茄钟，标记任务为已完成 */
function completePomodoro(taskId, duration) {
    const task = store.tasks.find((t) => t.id === taskId)

    task.status = 'completed'
}


export {
    store,
    addTask,
    deleteTask,
    updateTask,
    completePomodoro,
}
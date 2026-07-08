<template>
  <div >


    <div v-if="isOpen" class="overlay" @click.self="handleClose">
      <div class="popup">
        <div class="header">
          <h3>专注时钟</h3>
          <button class="close-btn" @click="handleClose">×</button>
        </div>

        <p class="subtitle">当前任务：{{ selectedTaskTitle }}</p>
        <div class="timer">{{ formattedTime }}</div>

        <div class="toolbar">
          <button class="primary" @click="toggleTimer">{{ isRunning ? '暂停' : '开始' }}</button>
          <button @click="resetTimer">重置</button>
          <button @click="requestNotificationPermission">通知权限</button>
        </div>

        <div class="meta">
          <span>专注时长：{{ currentTaskDuration }} 分钟</span>
        </div>



        <p class="status">{{ statusText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import './FocusTimer.css'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { completePomodoro, store } from '../store/store'

const isOpen = ref(false)
const remainingSeconds = ref(25 * 60)
const isRunning = ref(false)
const statusText = ref('准备开始')
const selectedTaskId = ref('')
const timerId = ref(null)

//  每个任务独立的计时状态
const taskTimerMap = reactive({})

function getTaskState(taskId) {
  if (!taskTimerMap[taskId]) {
    taskTimerMap[taskId] = {
      remainingSeconds: getTask(taskId).duration * 60, 
      isRunning: false,
      statusText: '准备开始',
    }
  }
  return taskTimerMap[taskId]
}

function getTask(taskId) {
  return store.tasks.find((task) => task.id === taskId)
}

const pendingTasks = computed(() => store.tasks.filter((task) => task.status === 'pending'))

//  当前任务自己的专注时长
const currentTaskDuration = computed(() => {
  const task = store.tasks.find((t) => t.id === selectedTaskId.value)
  return task?.duration || 25
})

const selectedTaskTitle = computed(() => {
  const task = pendingTasks.value.find((item) => item.id === selectedTaskId.value)
  return task ? task.title : '暂无任务'
})

const formattedTime = computed(() => {
  const minutes = String(Math.floor(remainingSeconds.value / 60)).padStart(2, '0')
  const seconds = String(remainingSeconds.value % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})

watch(
  () => store.tasks,
  () => {
    if (!selectedTaskId.value && pendingTasks.value.length) {
      selectedTaskId.value = pendingTasks.value[0].id
    }
  },
  { deep: true }
)

function openTimer(taskId) {
  isOpen.value = true
    selectedTaskId.value = taskId
    // 恢复该任务的独立状态
    const state = getTaskState(taskId)
    remainingSeconds.value = state.remainingSeconds
    isRunning.value = false
    statusText.value = state.statusText
    clearTimer()
    startTimer()

}

function clearTimer() {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
}

function startTimer() {
  if (timerId.value) return
  isRunning.value = true
  statusText.value = '专注中'
  timerId.value = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
      //  保存当前任务的剩余时间
      if (selectedTaskId.value) {
        getTaskState(selectedTaskId.value).remainingSeconds = remainingSeconds.value
      }
    } else {
      finishTimer()
    }
  }, 1000)
}

function pauseTimer() {
  clearTimer()
  isRunning.value = false
  statusText.value = '已暂停'
}

function toggleTimer() {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function resetTimer() {
  clearTimer()
  isRunning.value = false
  remainingSeconds.value = currentTaskDuration.value * 60
  statusText.value = '已重置'
  // 保存重置后的状态
  if (selectedTaskId.value) {
    const state = getTaskState(selectedTaskId.value)
    state.remainingSeconds = remainingSeconds.value
    state.statusText = '已重置'
  }
}

function finishTimer() {
  clearTimer()
  isRunning.value = false

  if (selectedTaskId.value) {
    completePomodoro(selectedTaskId.value, currentTaskDuration.value)
    statusText.value = '专注完成'
  } else {
    statusText.value = '请选择任务后再完成番茄钟'
  }

  remainingSeconds.value = 0
  //  保存完成状态
  if (selectedTaskId.value) {
    getTaskState(selectedTaskId.value).remainingSeconds = 0
  }
  showNotification('专注结束', '本次番茄钟已完成')
  ElMessage.success('番茄钟完成')
}

function handleClose() {
  // 暂停计时并隐藏弹窗，重新打开时按钮应显示“开始”
  clearTimer()
  isRunning.value = false
  isOpen.value = false
  statusText.value = '已关闭计时器'
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    ElMessage.warning('当前浏览器不支持通知')
    return
  }

  if (Notification.permission === 'granted') {
    showNotification('通知已开启', '你将收到专注结束提醒')
    return
  }

  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      showNotification('通知已开启', '你将收到专注结束提醒')
    } else {
      ElMessage.warning('通知权限已拒绝')
    }
  })
}

function showNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body })
  }
}

onBeforeUnmount(() => {
  clearTimer()
})
function resetTaskState(taskId) {
  if (taskTimerMap[taskId]) {
    delete taskTimerMap[taskId]
  }
  return
}

defineExpose({ openTimer,resetTaskState })
</script>
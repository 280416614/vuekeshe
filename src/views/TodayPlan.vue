<template>
  <div class="today-plan-page">
    <h2>学习计划</h2>
    <p>学如逆水行舟，不进则退。</p>

    <div>
      <el-button type="primary" class="btn2" @click="$router.push('/add-task')">+ 添加任务</el-button>
    </div>

    <ul>
      <li
        v-for="task in sortedTasks"
        :key="task.id"
        :class="{ completed: task.status === 'completed' }"
      >
        <span>{{ task.title }}
        <el-button size="big" text  class="btn" :disabled="task.status === 'completed'" @click="opentimer(task.id)">🍅</el-button>
        </span>
        
        <span class="actions">
        <el-button size="big" text  class="btn" :disabled="task.status === 'completed'" @click="openDialog(task.id)">✏️</el-button>
        <el-button size="big" text  class="btn" @click="handleDelete(task.id)">🗑️</el-button>
        </span>
      </li>
    </ul>

    <FocusTimer ref="focusTimerRef" />
    <Settings ref="settingsRef" @saved="onTaskSaved" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { store, deleteTask } from '../store/store'
import FocusTimer from './FocusTimer.vue'
import Settings from './Settings.vue'

const focusTimerRef = ref(null) 
const settingsRef = ref(null)

// 已完成任务排到最底下
const sortedTasks = computed(() => {
  const pending = store.tasks.filter((t) => t.status === 'pending')
  const completed = store.tasks.filter((t) => t.status === 'completed')
  return [...pending, ...completed]
})

function handleDelete(id) {
  deleteTask(id)
}

function opentimer(taskId) {
  focusTimerRef.value?.openTimer(taskId)
}

function openDialog(taskId) {
  settingsRef.value?.openDialog(taskId)
}

function onTaskSaved(taskId) {
  focusTimerRef.value?.resetTaskState(taskId)
}

</script>

<style scoped>


</style>
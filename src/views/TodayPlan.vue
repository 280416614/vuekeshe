<template>
  <div class="today-plan-page">
    <h2>学习计划</h2>
    <p>开始一个专注时段，跟着番茄钟把学习任务推进下去。</p>

    <div class="task-form">
      <el-input v-model="title" placeholder="任务标题" style="width: 220px" />
      <el-button type="primary" @click="handleAdd">添加任务</el-button>
    </div>

    <!-- ④ 直接循环渲染 store.tasks（响应式列表） -->
    <ul>
      <li v-for="task in store.tasks" :key="task.id">
        <span>
        {{ task.title }}
        </span>
        <span class="actions">
        <el-button size="big" text type="warning" class="btn" @click="opentimer(task)">🍅</el-button>
        <el-button size="big" text type="danger" class="btn" @click="openDialog(task.id)">✏️</el-button>
        <el-button size="big" text type="danger" class="btn" @click="handleDelete(task.id)">🗑️</el-button>
        </span>
        <!-- ⑤ 调用 deleteTask -->
      </li>
    </ul>

    <FocusTimer ref="focusTimerRef" />
    <Settings ref="settingsRef" /> 
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store, addTask, deleteTask } from '../store/store'
import FocusTimer from './FocusTimer.vue'
import Settings from './Settings.vue'

const title = ref('')
const focusTimerRef = ref(null) 
const settingsRef = ref(null)

function handleAdd() {
  if (!title.value.trim()) return
  addTask(title.value.trim())  // 改 store → 自动存盘、自动渲染
  title.value = ''
}

function handleDelete(id) {
  deleteTask(id)
}

function opentimer(task) {
  focusTimerRef.value?.openTimer(task.id)
}

function openDialog(taskId) {
  settingsRef.value?.openDialog(taskId)
}
</script>

<style scoped>


</style>
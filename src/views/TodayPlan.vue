<template>
  <div class="today-plan-page">
    <h2>学习计划</h2>
    <p>开始一个专注时段，跟着番茄钟把学习任务推进下去。</p>

    <div class="task-form">
      <el-input v-model="title" placeholder="任务标题" style="width: 220px" />
      <el-input-number v-model="pomos" :min="1" :max="20" />
      <el-button type="primary" @click="handleAdd">添加任务</el-button>
    </div>

    <ul class="task-list">
      <li v-for="task in store.tasks" :key="task.id" class="task-item">
        <div class="task-main">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-progress">{{ task.completedPomodoros }} / {{ task.estimatedPomodoros }}</span>
        </div>
        <div class="actions">
          <el-button size="small" text type="warning" class="btn" @click="opensettime">✏️</el-button>
          <el-button size="small" text type="danger" class="btn" @click="opentimer(task)">🍅</el-button>
          <el-button size="small" text type="danger" class="btn" @click="handleDelete(task.id)">🗑️</el-button>
        </div>
      </li>
    </ul>

    <FocusTimer ref="focusTimerRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store, addTask, deleteTask } from '../store/store'
import FocusTimer from './FocusTimer.vue'

const title = ref('')
const pomos = ref(1)
const focusTimerRef = ref(null)

function handleAdd() {
  if (!title.value.trim()) return
  addTask(title.value.trim(), pomos.value)
  title.value = ''
  pomos.value = 1
}

function handleDelete(id) {
  deleteTask(id)
}

function opentimer(task) {
  focusTimerRef.value?.openTimer(task.id)
}

function opensettime() {
  // 后续可以接入编辑逻辑
}
</script>

<style scoped>
.today-plan-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

h2 {
  margin-bottom: 8px;
}

p {
  color: #606266;
  margin-bottom: 16px;
}

.task-form {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.task-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-title {
  font-weight: 600;
}

.task-progress {
  color: #606266;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 4px;
}

.btn {
  border: none !important;
  background: transparent !important;
}

.btn:hover {
  transform: scale(1.1);
  background: transparent !important;
  border: none !important;
}
</style>
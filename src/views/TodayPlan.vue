<template>
  <div class="today-plan-page">
    <h2>学习计划</h2>
    <p>开始一个专注时段，跟着番茄钟把学习任务推进下去。</p>

    <div class="task-form">
      <el-input v-model="title" placeholder="任务标题" style="width: 220px" />
      <el-input-number v-model="pomos" :min="1" :max="20" />
      <el-button type="primary" @click="handleAdd">添加任务</el-button>
    </div>

    <!-- ② 表单：输入任务标题 -->
    <el-input v-model="title" placeholder="任务标题" style="width: 200px" />
    <!-- ③ 调用 addTask（修改 store） -->
    <el-button type="primary" @click="handleAdd">添加任务</el-button>

    <!-- ④ 直接循环渲染 store.tasks（响应式列表） -->
    <ul>
      <li v-for="task in store.tasks" :key="task.id">
        <span>
        {{ task.title }}
        </span>
        <span class="actions">
        <el-button size="big" text type="warning" class="btn" @click="opentimer(task)">🍅</el-button>
        <el-button size="big" text type="danger" class="btn" @click="editTask(task)">✏️</el-button>
        <el-button size="big" text type="danger" class="btn" @click="handleDelete(task.id)">🗑️</el-button>
        </span>
        <!-- ⑤ 调用 deleteTask -->
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
const focusTimerRef = ref(null) 

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
</script>

<style scoped>


</style>
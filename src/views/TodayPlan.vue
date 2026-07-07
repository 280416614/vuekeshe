<template>
  <div class="page">
    <h2>今日计划</h2>

    <!-- ① 绑定 store.settings（响应式读取） -->
    <p>你好，{{ store.settings.username }}！默认专注 {{ store.settings.focusDuration }} 分钟</p>

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
// ⑥ 按需导入
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
  deleteTask(id)  // 改 store → 自动存盘、自动渲染
}

function opentimer(task) {
  focusTimerRef.value?.openTimer(task.id)  // 把任务 id 传过去
}
</script>

<style scoped>


</style>
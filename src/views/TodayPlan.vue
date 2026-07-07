<template>
  <div class="page">
    <h2>今日计划</h2>

    <!-- ① 绑定 store.settings（响应式读取） -->
    <p>你好，{{ store.settings.username }}！默认专注 {{ store.settings.focusDuration }} 分钟</p>

    <!-- ② 表单：输入任务标题 + 番茄数 -->
    <el-input v-model="title" placeholder="任务标题" style="width: 200px" />
    <el-input-number v-model="pomos" :min="1" :max="20" />
    <!-- ③ 调用 addTask（修改 store） -->
    <el-button type="primary" @click="handleAdd">添加任务</el-button>

    <!-- ④ 直接循环渲染 store.tasks（响应式列表） -->
    <ul>
      <li v-for="task in store.tasks" :key="task.id">
        {{ task.title }}
        （{{ task.completedPomodoros }} / {{ task.estimatedPomodoros }} 
        <el-button size="big"  text type="danger" class="btn" @click="opensettime">✏️</el-button>
        ）
        <span class="actions">
        <el-button size="big"  text type="danger" class="btn" @click="opentimer(task)">🍅</el-button>
        <el-button size="big"  text type="danger" class="btn" @click="handleDelete(task.id)">🗑️</el-button>
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
const pomos = ref(1)
const isopen = ref(false)
const focusTimerRef = ref(null) 

function handleAdd() {
  if (!title.value.trim()) return
  addTask(title.value.trim(), pomos.value)  // 改 store → 自动存盘、自动渲染
  title.value = ''
  pomos.value = 1
}

function handleDelete(id) {
  deleteTask(id)  // 改 store → 自动存盘、自动渲染
}

function opentimer(task) {
  focusTimerRef.value?.openTimer(task.id)  // 把任务 id 传过去
}
function opensettime() {
  // 实现打开设置时间的逻辑
}
</script>

<style scoped>
.page { padding: 24px; }
li { margin: 8px 0; }

.btn {
  border: none !important;
  background: transparent !important;
}
.btn:hover {
  transform: scale(1.3);
  background: transparent !important;
  border: none !important;
}
</style>
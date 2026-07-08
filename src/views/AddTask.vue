<template>
  <div class="add-task-page">
    <h3>添加任务</h3>
    <p2>之能为人，由腹有诗书。——韩愈</p2>

    <el-form label-position="top">
      <el-form-item  label="任务名称" class="titleform">
        <el-input class="additem" v-model="title" placeholder="请输入任务名称" />
      </el-form-item>

      <el-form-item class="titleform" label="专注时长（分钟）">
        <el-input-number v-model="duration" :min="1" :max="999" />
      </el-form-item>

      <el-form-item>
        <el-button class="btn2" type="primary" @click="$router.push('/')">取消</el-button>
        <el-button class="btn2" type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addTask } from '../store/store'

const router = useRouter()
const title = ref('')
const duration = ref(25)

function handleSave() {
  if (!title.value.trim()) return
  addTask(title.value.trim(), duration.value)
  router.push('/')
}
</script>

<style scoped>
.titleform :deep(.el-form-item__label) {
  color: #ffffffac;
  font-weight: bold;
}
</style>

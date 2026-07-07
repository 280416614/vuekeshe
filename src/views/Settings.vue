<template>
  <div class="settings-page">
    <el-dialog
      v-model="dialogVisible"
      title="编辑任务"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="editTitle" placeholder="请输入任务名称" />
        </el-form-item>

        <el-form-item label="倒计时时长">
          <el-input-number v-model="editFocusDuration" :min="1" :max="90" />
          <span class="hint">单位：分钟</span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { store, updateTask } from '../store/store'

const dialogVisible = ref(false)
const editTitle = ref('')
const editFocusDuration = ref(25)
const currentTaskId = ref('')

function openDialog(taskId=null) {
  const targetTask = taskId
    ? store.tasks.find((task) => task.id === taskId)
    : store.tasks[0]

  if (!targetTask) {
    ElMessage.warning('当前没有任务可编辑')
    return
  }

  currentTaskId.value = targetTask.id
  editTitle.value = targetTask.title
  editFocusDuration.value = store.settings.focusDuration
  dialogVisible.value = true
}

function handleSave() {
  if (!currentTaskId.value) {
    ElMessage.warning('请选择任务')
    return
  }
  if (!editTitle.value.trim()) {
    ElMessage.warning('任务名称不能为空')
    return
  }

  updateTask(currentTaskId.value, {
    title: editTitle.value.trim(),
  })

  store.settings.focusDuration = Number(editFocusDuration.value)

  ElMessage.success('任务已更新')
  dialogVisible.value = false
}

defineExpose({ openDialog })
</script>

<style scoped>
.settings-page {
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

.hint {
  margin-left: 8px;
  color: #909399;
  font-size: 13px;
}
</style>

<template>
  <div class="page">
    <header class="head">
      <div>
        <h1>事件时间线</h1>
        <p class="sub">合并「浏览日志」与「演示通知」（A12 / A13），按时间倒序。</p>
      </div>
      <div class="actions">
        <el-button type="warning" plain @click="onClearJournal">清空浏览日志</el-button>
        <el-button @click="$router.push('/home')">主页</el-button>
      </div>
    </header>

    <el-card shadow="hover">
      <el-timeline>
        <el-timeline-item
          v-for="row in merged"
          :key="row.uid"
          :timestamp="row.timeLabel"
          placement="top"
          :type="row.color"
        >
          <div class="row-title">{{ row.title }}</div>
          <div v-if="row.detail" class="row-detail">{{ row.detail }}</div>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="!merged.length" description="暂无事件，在站内浏览或使用通知演示即可产生记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { listJournalEvents, clearJournalEvents } from '@/utils/eventJournal'
import { listDemoNotifications } from '@/utils/demoNotifications'

const journal = ref([])
const notifs = ref([])

function refresh () {
  journal.value = listJournalEvents()
  notifs.value = listDemoNotifications()
}

const merged = computed(() => {
  const j = journal.value.map(e => ({
    uid: `j_${e.id}`,
    at: e.at,
    timeLabel: formatTime(e.at),
    title: e.title,
    detail: e.detail,
    color: e.kind === 'browse' ? 'info' : 'primary'
  }))
  const n = notifs.value.map(e => ({
    uid: `n_${e.id}`,
    at: e.at,
    timeLabel: formatTime(e.at),
    title: `[通知] ${e.title}`,
    detail: e.body,
    color: e.read ? '' : 'success'
  }))
  return [...j, ...n].sort((a, b) => b.at - a.at).slice(0, 120)
})

function formatTime (ts) {
  const d = new Date(ts)
  if (isNaN(d.getTime())) return '-'
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function onClearJournal () {
  try {
    await ElMessageBox.confirm('仅清空浏览类本地日志，不影响通知列表。', '清空日志', { type: 'warning' })
    clearJournalEvents()
    refresh()
    ElMessage.success('已清空浏览日志')
  } catch (e) {
    void e
  }
}

onMounted(refresh)
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.head h1 {
  margin: 0 0 6px;
  font-size: 1.45rem;
}
.sub {
  margin: 0;
  color: #606266;
  font-size: 0.88rem;
}
.row-title {
  font-weight: 600;
  color: #303133;
}
.row-detail {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
  word-break: break-all;
}
</style>

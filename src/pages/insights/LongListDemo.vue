<template>
  <div class="longlist-page">
    <header class="head">
      <div>
        <h1>长列表渲染优化演示</h1>
        <p class="sub">CSS content-visibility + 固定行高 · 报告可写「万级 DOM 性能」</p>
      </div>
      <div class="actions">
        <el-input-number v-model="rowCount" :min="500" :max="15000" :step="500" size="small" />
        <el-button type="primary" @click="regen">重新生成</el-button>
        <el-button @click="$router.push('/tools')">返回工具列表</el-button>
      </div>
    </header>
    <p class="hint">共 {{ items.length }} 行虚拟占位数据。仅用于答辩/报告截图，不参与业务。</p>
    <div class="scroll" ref="scrollRef">
      <div
        v-for="row in items"
        :key="row.id"
        class="row cv-row"
      >
        <span class="idx">#{{ row.id }}</span>
        <span class="title">{{ row.title }}</span>
        <el-tag size="small" type="info">{{ row.tag }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const rowCount = ref(5000)
const items = ref([])
const scrollRef = ref(null)

function regen () {
  const n = Math.min(15000, Math.max(500, rowCount.value))
  const out = []
  const tags = ['工具', '课程', '项目', 'DevOps', '前端', '数据']
  for (let i = 1; i <= n; i++) {
    out.push({
      id: i,
      title: `演示条目 ${i} · 软件工程资源平台`,
      tag: tags[i % tags.length]
    })
  }
  items.value = out
}

watch(rowCount, () => regen(), { immediate: true })
</script>

<style scoped>
.longlist-page {
  min-height: 100vh;
  padding: 20px;
  background: #0f172a;
  color: #e2e8f0;
}
.head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.head h1 {
  margin: 0;
  font-size: 1.35rem;
}
.sub {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 0.85rem;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.hint {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 12px;
}
.scroll {
  max-height: calc(100vh - 200px);
  overflow: auto;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.6);
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
  min-height: 44px;
  box-sizing: border-box;
}
.cv-row {
  content-visibility: auto;
  contain-intrinsic-size: 44px 100%;
}
.idx {
  font-variant-numeric: tabular-nums;
  color: #64748b;
  width: 72px;
  flex-shrink: 0;
}
.title {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.88rem;
}
</style>

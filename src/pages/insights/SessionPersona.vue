<template>
  <div class="page">
    <header class="head">
      <div>
        <h1>本机会话画像</h1>
        <p class="sub">基于 localStorage 的浏览与搜索聚合（A05），不上传服务器。</p>
      </div>
      <div class="actions">
        <el-button type="danger" plain @click="onReset">清空画像数据</el-button>
        <el-button @click="$router.push('/home')">主页</el-button>
      </div>
    </header>

    <el-row :gutter="16">
      <el-col :xs="24" :md="8">
        <el-card shadow="hover">
          <template #header>会话概览</template>
          <ul class="kv">
            <li><span>记录开始</span><b>{{ started }}</b></li>
            <li><span>路由访问条数</span><b>{{ data.routes.length }}</b></li>
            <li><span>不同资源键</span><b>{{ resourceKeyCount }}</b></li>
            <li><span>不同搜索词</span><b>{{ searchKeyCount }}</b></li>
          </ul>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="16">
        <el-card shadow="hover">
          <template #header>搜索词 Top</template>
          <el-empty v-if="!topQueries.length" description="暂无搜索记录" />
          <div v-else class="tags">
            <el-tag v-for="([q, c], i) in topQueries" :key="i" class="mr-2 mb-2" type="info">
              {{ q }} × {{ c }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt-4" shadow="never">
      <template #header>资源访问 Top（路由名:ID）</template>
      <el-table v-if="topResources.length" :data="topResources" size="small" stripe>
        <el-table-column prop="key" label="键" min-width="200" />
        <el-table-column prop="count" label="次数" width="90" />
      </el-table>
      <el-empty v-else description="暂无详情页访问统计" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getSessionAnalytics, resetSessionAnalytics } from '@/utils/sessionAnalytics'

const data = ref({ routes: [], resourceViews: {}, searchQueries: {}, startedAt: 0 })

function refresh () {
  data.value = getSessionAnalytics()
}

const started = computed(() => {
  const t = data.value.startedAt
  if (!t) return '-'
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const topQueries = computed(() => {
  const ent = Object.entries(data.value.searchQueries || {})
  ent.sort((a, b) => b[1] - a[1])
  return ent.slice(0, 24)
})

const topResources = computed(() => {
  const ent = Object.entries(data.value.resourceViews || {})
  ent.sort((a, b) => b[1] - a[1])
  return ent.slice(0, 30).map(([key, count]) => ({ key, count }))
})

const resourceKeyCount = computed(() => Object.keys(data.value.resourceViews || {}).length)
const searchKeyCount = computed(() => Object.keys(data.value.searchQueries || {}).length)

async function onReset () {
  try {
    await ElMessageBox.confirm('确定清空本机会话画像与统计？', '确认', { type: 'warning' })
    resetSessionAnalytics()
    refresh()
    ElMessage.success('已清空')
  } catch (e) {
    void e
  }
}

onMounted(() => {
  refresh()
})
</script>

<style scoped>
.page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
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
.kv {
  list-style: none;
  padding: 0;
  margin: 0;
}
.kv li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}
.kv li:last-child {
  border-bottom: none;
}
.kv span {
  color: #909399;
}
</style>

<template>
  <div class="ops-dashboard">
    <header class="dash-header">
      <div>
        <h1>资源数据概览</h1>
        <p class="sub">基于当前库内工具、课程、项目的实时统计</p>
      </div>
      <div class="header-actions">
        <span class="clock">{{ nowText }}</span>
        <el-button type="primary" plain @click="refreshCharts">
          <i class="fas fa-sync-alt mr-1" :class="{ 'fa-spin': refreshing }" /> 刷新指标
        </el-button>
        <el-button @click="$router.push('/home')">
          <i class="fas fa-home mr-1" /> 返回主页
        </el-button>
      </div>
    </header>

    <section class="kpi-row">
      <div v-for="k in kpis" :key="k.label" class="kpi-card">
        <div class="kpi-label">{{ k.label }}</div>
        <div class="kpi-value">{{ k.value }}</div>
        <div class="kpi-trend muted-trend">
          {{ k.delta }}
        </div>
      </div>
    </section>

    <div class="chart-grid chart-grid--two">
      <div class="chart-panel">
        <h3>资源类型占比</h3>
        <div ref="pieRef" class="chart-box" />
      </div>
      <div class="chart-panel">
        <h3>工具分类 TOP</h3>
        <div ref="barRef" class="chart-box" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { HttpManager } from '@/api'

const pieRef = ref(null)
const barRef = ref(null)
const refreshing = ref(false)
const nowText = ref('')

let charts = []
let tickTimer

const kpis = ref([
  { label: '累计资源条目', value: '—', delta: '工具 + 课程 + 项目' },
  { label: '待审核队列', value: '—', delta: '三类待审合计' },
  { label: '工具资源', value: '—', delta: '已发布条目' },
  { label: '课程资源', value: '—', delta: '已发布条目' }
])

let stats = {
  tools: 0,
  courses: 0,
  projects: 0,
  pending: 0,
  pieData: [],
  barCategories: [],
  barValues: []
}

function extractList (res) {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.data?.results)) return res.data.results
  if (Array.isArray(res.results)) return res.results
  if (Array.isArray(res.courses_agg)) return res.courses_agg
  return []
}

function extractTotal (res, fallbackLen) {
  const t = res?.data?.total ?? res?.total ?? res?.data?.count ?? res?.count
  return t != null ? Number(t) : fallbackLen
}

function countToolCategories (tools) {
  const map = new Map()
  for (const t of tools) {
    const cat = t.category || t.catagory || '未分类'
    map.set(cat, (map.get(cat) || 0) + 1)
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
}

async function loadStats () {
  const [toolsRes, coursesRes, projectsRes, pTools, pCourses, pProjects] = await Promise.all([
    HttpManager.getTools({ page_size: 500 }).catch(() => null),
    HttpManager.getCourses({ limit: 500, cursor: 0 }).catch(() => null),
    HttpManager.getProjects({ limit: 500 }).catch(() => null),
    HttpManager.getPendingReviews({ type: 'tools', page: 1, page_size: 1 }).catch(() => null),
    HttpManager.getPendingReviews({ type: 'courses', page: 1, page_size: 1 }).catch(() => null),
    HttpManager.getPendingReviews({ type: 'projects', page: 1, page_size: 1 }).catch(() => null)
  ])

  const tools = extractList(toolsRes)
  const courses = extractList(coursesRes)
  const projects = extractList(projectsRes)

  const toolCount = extractTotal(toolsRes, tools.length)
  const courseCount = extractTotal(coursesRes, courses.length)
  const projectCount = extractTotal(projectsRes, projects.length)
  const pending =
    extractTotal(pTools, 0) +
    extractTotal(pCourses, 0) +
    extractTotal(pProjects, 0)

  const topCats = countToolCategories(tools)

  stats = {
    tools: toolCount,
    courses: courseCount,
    projects: projectCount,
    pending,
    pieData: [
      { value: toolCount, name: '工具' },
      { value: courseCount, name: '课程' },
      { value: projectCount, name: '项目' }
    ].filter(d => d.value > 0),
    barCategories: topCats.map(([name]) => name),
    barValues: topCats.map(([, count]) => count)
  }

  kpis.value = [
    { label: '累计资源条目', value: String(toolCount + courseCount + projectCount), delta: `${toolCount} 工具 · ${courseCount} 课程 · ${projectCount} 项目` },
    { label: '待审核队列', value: String(pending), delta: pending > 0 ? '有待处理项' : '队列已清空' },
    { label: '工具资源', value: String(toolCount), delta: '已入库条目' },
    { label: '课程资源', value: String(courseCount), delta: '已入库条目' }
  ]
}

function initPie () {
  if (!pieRef.value) return
  const c = echarts.init(pieRef.value)
  const data = stats.pieData.length
    ? stats.pieData
    : [{ value: 1, name: '暂无数据' }]
  c.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#94a3b8' } },
    series: [{
      type: 'pie',
      radius: ['42%', '68%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#0f172a', borderWidth: 2 },
      label: { color: '#e2e8f0' },
      data
    }]
  })
  charts.push(c)
}

function initBar () {
  if (!barRef.value) return
  const c = echarts.init(barRef.value)
  const categories = stats.barCategories.length ? stats.barCategories : ['暂无分类']
  const values = stats.barValues.length ? stats.barValues : [0]
  c.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 72, right: 16, top: 24, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      type: 'bar',
      data: values,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#22d3ee' },
          { offset: 1, color: '#6366f1' }
        ]),
        borderRadius: [0, 6, 6, 0]
      }
    }]
  })
  charts.push(c)
}

function disposeAll () {
  charts.forEach((c) => {
    c.dispose()
  })
  charts = []
}

function resizeAll () {
  charts.forEach((c) => c.resize())
}

async function refreshCharts () {
  refreshing.value = true
  try {
    await loadStats()
  } catch (e) {
    console.warn('[dashboard] 刷新统计失败', e)
  }
  disposeAll()
  await nextTick()
  initPie()
  initBar()
  resizeAll()
  refreshing.value = false
}

function updateClock () {
  const d = new Date()
  nowText.value = d.toLocaleString('zh-CN', { hour12: false })
}

onMounted(async () => {
  updateClock()
  tickTimer = setInterval(updateClock, 1000)
  await refreshCharts()
  window.addEventListener('resize', resizeAll)
})

onUnmounted(() => {
  clearInterval(tickTimer)
  window.removeEventListener('resize', resizeAll)
  disposeAll()
})
</script>

<style scoped>
.ops-dashboard {
  min-height: 100vh;
  background: radial-gradient(1200px 600px at 10% -10%, rgba(56, 189, 248, 0.18), transparent),
    radial-gradient(900px 500px at 100% 0%, rgba(167, 139, 250, 0.15), transparent),
    #0b1220;
  color: #e2e8f0;
  padding: 24px 28px 40px;
  box-sizing: border-box;
}
.dash-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.dash-header h1 {
  margin: 0;
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.sub {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: 0.9rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.clock {
  font-variant-numeric: tabular-nums;
  color: #64748b;
  font-size: 0.9rem;
}
.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}
.kpi-card {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  padding: 16px 18px;
  backdrop-filter: blur(8px);
}
.kpi-label {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 6px;
}
.kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
}
.muted-trend {
  margin-top: 8px;
  font-size: 0.78rem;
  color: #64748b;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.chart-panel {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  padding: 16px 18px 8px;
}
.chart-panel h3 {
  margin: 0 0 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #cbd5e1;
}
.chart-note {
  margin: 0 0 4px;
  font-size: 0.75rem;
  color: #64748b;
}
.chart-box {
  width: 100%;
  height: 280px;
}
@media (max-width: 960px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>

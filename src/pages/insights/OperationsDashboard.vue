<template>
  <div class="ops-dashboard">
    <header class="dash-header">
      <div>
        <h1>资源运营数据大屏</h1>
        <p class="sub">多源聚合 · 演示数据可对接真实统计接口</p>
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
        <div class="kpi-trend" :class="k.up ? 'up' : 'down'">
          <i :class="k.up ? 'fas fa-arrow-trend-up' : 'fas fa-arrow-trend-down'" />
          {{ k.delta }}
        </div>
      </div>
    </section>

    <div class="chart-grid">
      <div class="chart-panel">
        <h3>近 7 日提交与审核量</h3>
        <div ref="lineRef" class="chart-box" />
      </div>
      <div class="chart-panel">
        <h3>资源类型占比</h3>
        <div ref="pieRef" class="chart-box" />
      </div>
      <div class="chart-panel">
        <h3>工具分类 TOP</h3>
        <div ref="barRef" class="chart-box" />
      </div>
      <div class="chart-panel">
        <h3>审核通过率趋势</h3>
        <div ref="areaRef" class="chart-box" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const lineRef = ref(null)
const pieRef = ref(null)
const barRef = ref(null)
const areaRef = ref(null)
const refreshing = ref(false)
const nowText = ref('')

let charts = []
let tickTimer

const kpis = ref([
  { label: '累计资源条目', value: '—', delta: '周环比 +12%', up: true },
  { label: '待审核队列', value: '—', delta: '较昨日 -3', up: true },
  { label: '7 日活跃用户(估)', value: '—', delta: '演示口径', up: true },
  { label: '平均审核耗时(h)', value: '—', delta: '目标 < 24h', up: true }
])

function buildMockSeries () {
  const days = ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', '今日']
  const submit = [12, 19, 8, 22, 15, 28, 21]
  const review = [10, 14, 9, 18, 14, 24, 19]
  return { days, submit, review }
}

function initLine () {
  if (!lineRef.value) return
  const c = echarts.init(lineRef.value, null, { renderer: 'canvas' })
  const { days, submit, review } = buildMockSeries()
  c.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['提交', '完成审核'], textStyle: { color: '#94a3b8' } },
    grid: { left: 48, right: 24, top: 40, bottom: 32 },
    xAxis: { type: 'category', data: days, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.15)' } }, axisLabel: { color: '#94a3b8' } },
    series: [
      { name: '提交', type: 'line', smooth: true, data: submit, areaStyle: { opacity: 0.12 }, itemStyle: { color: '#38bdf8' } },
      { name: '完成审核', type: 'line', smooth: true, data: review, areaStyle: { opacity: 0.12 }, itemStyle: { color: '#a78bfa' } }
    ]
  })
  charts.push(c)
}

function initPie () {
  if (!pieRef.value) return
  const c = echarts.init(pieRef.value)
  c.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#94a3b8' } },
    series: [{
      type: 'pie',
      radius: ['42%', '68%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#0f172a', borderWidth: 2 },
      label: { color: '#e2e8f0' },
      data: [
        { value: 48, name: '工具' },
        { value: 32, name: '课程' },
        { value: 26, name: '项目' },
        { value: 14, name: '其它' }
      ]
    }]
  })
  charts.push(c)
}

function initBar () {
  if (!barRef.value) return
  const c = echarts.init(barRef.value)
  c.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 72, right: 16, top: 24, bottom: 24 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: {
      type: 'category',
      data: ['DevOps', '前端', '后端', '移动', '数据', '测试'],
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      type: 'bar',
      data: [23, 41, 35, 18, 27, 15],
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

function initArea () {
  if (!areaRef.value) return
  const c = echarts.init(areaRef.value)
  const days = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']
  const rate = [0.72, 0.78, 0.81, 0.76, 0.85, 0.88, 0.91]
  c.setOption({
    tooltip: { trigger: 'axis', valueFormatter: (v) => `${(v * 100).toFixed(1)}%` },
    grid: { left: 48, right: 24, top: 32, bottom: 28 },
    xAxis: { type: 'category', data: days, axisLabel: { color: '#94a3b8' } },
    yAxis: {
      type: 'value',
      min: 0.5,
      max: 1,
      axisLabel: { formatter: (v) => `${(v * 100).toFixed(0)}%`, color: '#94a3b8' },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)' } }
    },
    series: [{
      type: 'line',
      smooth: true,
      data: rate,
      areaStyle: { color: 'rgba(52,211,153,0.25)' },
      lineStyle: { color: '#34d399', width: 3 },
      symbolSize: 8
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
  await new Promise((r) => setTimeout(r, 400))
  const jitter = () => Math.floor(Math.random() * 6) - 3
  kpis.value = [
    { label: '累计资源条目', value: String(1240 + jitter()), delta: '周环比 +12%', up: true },
    { label: '待审核队列', value: String(18 + jitter()), delta: '较昨日波动', up: jitter() >= 0 },
    { label: '7 日活跃用户(估)', value: String(320 + jitter() * 5), delta: '演示口径', up: true },
    { label: '平均审核耗时(h)', value: (8.2 + jitter() * 0.3).toFixed(1), delta: '目标 < 24h', up: jitter() <= 0 }
  ]
  disposeAll()
  await nextTick()
  initLine()
  initPie()
  initBar()
  initArea()
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
  await nextTick()
  initLine()
  initPie()
  initBar()
  initArea()
  kpis.value = [
    { label: '累计资源条目', value: '1240', delta: '周环比 +12%', up: true },
    { label: '待审核队列', value: '18', delta: '较昨日 -3', up: true },
    { label: '7 日活跃用户(估)', value: '326', delta: '演示口径', up: true },
    { label: '平均审核耗时(h)', value: '8.4', delta: '目标 < 24h', up: true }
  ]
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
}
.kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 6px;
  color: #f8fafc;
}
.kpi-trend {
  margin-top: 8px;
  font-size: 0.78rem;
}
.kpi-trend.up { color: #4ade80; }
.kpi-trend.down { color: #fb7185; }
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
@media (max-width: 1024px) {
  .chart-grid { grid-template-columns: 1fr; }
}
.chart-panel {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 14px 16px 8px;
}
.chart-panel h3 {
  margin: 0 0 8px 4px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #cbd5e1;
}
.chart-box {
  width: 100%;
  height: 300px;
}
</style>

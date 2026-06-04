<template>
  <div class="kg-page">
    <header class="kg-header">
      <div>
        <h1>资源关联图谱</h1>
        <p class="sub">根据标签共现展示工具、课程、项目之间的关联，点击节点可跳转详情</p>
      </div>
      <div class="actions">
        <el-button :loading="loading" @click="loadGraph">
          <i class="fas fa-sync-alt mr-1" /> 刷新
        </el-button>
        <el-button-group>
          <el-button :type="physics ? 'primary' : 'default'" @click="physics = true; applyPhysics()">力导向</el-button>
          <el-button :type="!physics ? 'primary' : 'default'" @click="physics = false; freezeLayout()">环形</el-button>
        </el-button-group>
        <el-button @click="$router.push('/insights/long-list')"><i class="fas fa-list mr-1" /> 资源目录</el-button>
        <el-button @click="$router.push('/home')"><i class="fas fa-home mr-1" /> 主页</el-button>
      </div>
    </header>

    <div class="legend">
      <span><i class="dot tool" /> 工具 ({{ stats.tools }})</span>
      <span><i class="dot course" /> 课程 ({{ stats.courses }})</span>
      <span><i class="dot project" /> 项目 ({{ stats.projects }})</span>
      <span class="edge-hint">连线越粗表示共享标签越多</span>
    </div>

    <div v-if="loading" class="loading"><i class="fas fa-spinner fa-spin" /> 构建关联图谱…</div>
    <div v-else-if="!graphData.nodes.length" class="empty">
      <el-empty description="暂无带标签的资源，请先在资源提交时填写标签" />
    </div>
    <div v-else ref="graphRef" class="graph-wrap" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { HttpManager } from '@/api'
import { extractApiList, mergeResources, buildTagGraph } from '@/utils/resourceCatalog'

const router = useRouter()
const graphRef = ref(null)
const physics = ref(true)
const loading = ref(true)
const graphData = ref({ nodes: [], links: [], categories: [] })
const stats = ref({ tools: 0, courses: 0, projects: 0 })
let chart

function buildOption () {
  const { nodes, links, categories } = graphData.value
  return {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (p) => {
        if (p.dataType === 'edge') {
          return `共享标签：${p.data.tags || ''}<br/>关联强度：${p.data.value}`
        }
        const d = p.data
        return `${d.fullName || d.name}<br/>类型：${d.typeLabel}<br/>点击跳转详情`
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      roam: true,
      draggable: true,
      force: {
        repulsion: 380,
        edgeLength: [70, 140],
        gravity: 0.1
      },
      categories,
      data: nodes.map(n => ({
        ...n,
        itemStyle: {
          color: n.category === 0 ? '#38bdf8' : n.category === 1 ? '#4ade80' : '#c084fc'
        }
      })),
      links: links.map(l => ({
        ...l,
        lineStyle: { width: 1 + l.value * 1.2, curveness: 0.15, opacity: 0.6 }
      })),
      label: { show: true, position: 'right', color: '#e2e8f0', fontSize: 10 },
      emphasis: { focus: 'adjacency', lineStyle: { width: 4, opacity: 1 } },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 8]
    }]
  }
}

function applyPhysics () {
  if (!chart) return
  chart.setOption({
    series: [{ layout: 'force', force: { repulsion: 380, edgeLength: [70, 140], gravity: 0.1 } }]
  })
}

function freezeLayout () {
  if (!chart) return
  chart.setOption({
    series: [{ layout: 'circular', circular: { rotateLabel: true } }]
  })
}

function onChartClick (params) {
  if (params.dataType === 'node' && params.data?.route) {
    router.push(params.data.route)
  }
}

function onResize () {
  chart && chart.resize()
}

async function loadGraph () {
  loading.value = true
  if (chart) {
    chart.dispose()
    chart = null
  }
  try {
    const [toolsRes, coursesRes, projectsRes] = await Promise.all([
      HttpManager.getTools({ page_size: 200 }),
      HttpManager.getCourses({ limit: 200, cursor: 0 }),
      HttpManager.getProjects({ limit: 200 })
    ])
    const tools = extractApiList(toolsRes)
    const courses = extractApiList(coursesRes)
    const projects = extractApiList(projectsRes)
    stats.value = { tools: tools.length, courses: courses.length, projects: projects.length }
    const merged = mergeResources(tools, courses, projects)
    graphData.value = buildTagGraph(merged)
  } catch (e) {
    console.error('[graph] 加载失败', e)
    graphData.value = { nodes: [], links: [], categories: [] }
  }
  loading.value = false
  await nextTick()
  if (graphRef.value && graphData.value.nodes.length) {
    chart = echarts.init(graphRef.value)
    chart.setOption(buildOption())
    chart.on('click', onChartClick)
  }
}

onMounted(async () => {
  await loadGraph()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (chart) {
    chart.off('click', onChartClick)
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.kg-page {
  min-height: 100vh;
  background: linear-gradient(165deg, #0c1929 0%, #111827 45%, #0f172a 100%);
  color: #e2e8f0;
  padding: 22px 24px 32px;
  box-sizing: border-box;
}
.kg-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 14px;
  margin-bottom: 12px;
}
.kg-header h1 {
  margin: 0;
  font-size: 1.55rem;
}
.sub {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: 0.88rem;
  max-width: 520px;
}
.actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #94a3b8;
}
.edge-hint { color: #64748b; }
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}
.dot.tool { background: #38bdf8; }
.dot.course { background: #4ade80; }
.dot.project { background: #c084fc; }
.graph-wrap {
  width: 100%;
  height: calc(100vh - 220px);
  min-height: 420px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.35);
}
.loading, .empty {
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}
</style>

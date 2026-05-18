<template>
  <div class="kg-page">
    <header class="kg-header">
      <div>
        <h1>资源关联图谱</h1>
        <p class="sub">按标签共现构建演示边 · 可对接后端图查询 API</p>
      </div>
      <div class="actions">
        <el-button-group>
          <el-button :type="physics ? 'primary' : 'default'" @click="physics = true; applyPhysics()">力导向</el-button>
          <el-button :type="!physics ? 'primary' : 'default'" @click="physics = false; freezeLayout()">固定布局</el-button>
        </el-button-group>
        <el-button @click="$router.push('/home')"><i class="fas fa-home mr-1" /> 主页</el-button>
      </div>
    </header>

    <div class="legend">
      <span><i class="dot tool" /> 工具</span>
      <span><i class="dot course" /> 课程</span>
      <span><i class="dot project" /> 项目</span>
    </div>

    <div ref="graphRef" class="graph-wrap" />
    <p class="hint">拖拽节点可调整视角；滚轮缩放。用于报告中的「知识关联 / 多资源一体化检索」叙事。</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const graphRef = ref(null)
const physics = ref(true)
let chart

const categories = [
  { name: '工具' },
  { name: '课程' },
  { name: '项目' }
]

const nodes = [
  { id: '0', name: 'Vue 生态', symbolSize: 52, category: 0, value: 10 },
  { id: '1', name: 'Go 微服务', symbolSize: 46, category: 0, value: 9 },
  { id: '2', name: '软工导论', symbolSize: 44, category: 1, value: 8 },
  { id: '3', name: 'Web 前端课', symbolSize: 42, category: 1, value: 8 },
  { id: '4', name: '实训平台', symbolSize: 56, category: 2, value: 12 },
  { id: '5', name: 'CI/CD 实践', symbolSize: 40, category: 2, value: 7 },
  { id: '6', name: 'Docker', symbolSize: 38, category: 0, value: 6 },
  { id: '7', name: 'REST 设计', symbolSize: 36, category: 1, value: 6 },
  { id: '8', name: '团队协作', symbolSize: 34, category: 2, value: 5 },
  { id: '9', name: 'MySQL', symbolSize: 36, category: 0, value: 6 }
]

const links = [
  { source: '0', target: '3', value: 3 },
  { source: '0', target: '4', value: 4 },
  { source: '1', target: '4', value: 5 },
  { source: '1', target: '5', value: 3 },
  { source: '2', target: '3', value: 2 },
  { source: '3', target: '4', value: 4 },
  { source: '6', target: '1', value: 3 },
  { source: '6', target: '5', value: 2 },
  { source: '7', target: '4', value: 3 },
  { source: '9', target: '4', value: 4 },
  { source: '8', target: '4', value: 2 },
  { source: '0', target: '6', value: 2 }
]

function buildOption () {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (p) => {
        if (p.dataType === 'edge') {
          return `${p.data.source} → ${p.data.target}<br/>关联强度: ${p.data.value}`
        }
        return `${p.data.name}<br/>类型: ${categories[p.data.category].name}`
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      roam: true,
      draggable: true,
      force: {
        repulsion: 420,
        edgeLength: [80, 160],
        gravity: 0.08
      },
      categories,
      data: nodes.map((n) => ({
        ...n,
        itemStyle: {
          color: n.category === 0 ? '#38bdf8' : n.category === 1 ? '#4ade80' : '#c084fc'
        }
      })),
      links: links.map((l) => ({
        ...l,
        lineStyle: { width: 1 + l.value, curveness: 0.12, opacity: 0.55 }
      })),
      label: { show: true, position: 'right', color: '#e2e8f0', fontSize: 11 },
      emphasis: { focus: 'adjacency', lineStyle: { width: 4, opacity: 1 } },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 10]
    }]
  }
}

function applyPhysics () {
  if (!chart) return
  chart.setOption({
    series: [{ layout: 'force', force: { repulsion: 420, edgeLength: [80, 160], gravity: 0.08 } }]
  })
}

function freezeLayout () {
  if (!chart) return
  chart.setOption({
    series: [{ layout: 'circular', circular: { rotateLabel: true } }]
  })
}

function onResize () {
  chart && chart.resize()
}

onMounted(async () => {
  await nextTick()
  if (!graphRef.value) return
  chart = echarts.init(graphRef.value)
  chart.setOption(buildOption())
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (chart) {
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
}
.actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.legend {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #94a3b8;
}
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
.hint {
  margin-top: 12px;
  font-size: 0.8rem;
  color: #64748b;
}
</style>
